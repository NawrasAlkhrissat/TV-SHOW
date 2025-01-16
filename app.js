const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const Show = require('./models/showModel');
const Joi = require('joi');
main().catch(err => console.log(err));
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/TV-Show');
    console.log("DB Connected");
}
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));



// app.get('/shows', async (req, res) => {
//     const shows = await show.find({});
//     res.render('index.ejs', { shows });
// })

// app.get('/shows/new', (req, res) => {
//     res.render('new.ejs');
// })

// app.post('/shows', async (req, res) => {
//     const newShow = await new show(req.body.show);
//     await newShow.save();
//     res.redirect(`/shows/${newShow._id}`);
// })

// app.get('/shows/:id', async (req, res) => {
//     const IdShow = await show.findById(req.params.id);
//     res.render('details.ejs', { IdShow });
// })

// app.get('/shows/:id/edit', async (req, res) => {
//     const IdShow = await show.findById(req.params.id);
//     res.render('edit.ejs', { IdShow });
// })
// app.put('/shows/:id', async (req, res) => {
//     const { id } = req.params;
//     const IdShow = await show.findByIdAndUpdate(id, { ...req.body.show });
//     res.redirect(`/shows/${IdShow._id}`);
// })

// app.delete('/shows/:id', async (req, res) => {
//     const IdShow = await show.findByIdAndDelete(req.params.id);
//     res.redirect('/shows');
// })

// app.listen(3000, () => {
//     console.log("on the listen part");
// })

const validateShow = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required().messages({
            'string.empty': 'Name is required.',
            'string.min': 'Name must be at least 3 characters.',
        }),
        language: Joi.string().required().messages({
            'string.empty': 'Language is required.',
        }),
        image: Joi.string().uri().required().messages({
            'string.empty': 'Image URL is required.',
            'string.uri': 'Image must be a valid URL.',
        }),
        url: Joi.string().uri().required().messages({
            'string.empty': 'URL is required.',
            'string.uri': 'URL must be a valid URL.',
        }),
        type: Joi.string().optional(),
        dis: Joi.string().optional(),
    });

    return schema.validate(data, { abortEarly: false });
};


app.get('/shows', async (req, res, next) => {
    try {
        const shows = await Show.find({});
        res.render('index.ejs', { shows });
    } catch (e) {
        next(new AppError("Failed to fetch shows. Please try again later.", 500));
    }
});

app.get('/shows/new', (req, res) => {
    res.render('new.ejs');
});

app.post('/shows', async (req, res, next) => {
    try {
        const { error } = validateShow(req.body.show);
        if (error) {
            const message = error.details.map((el) => el.message).join(', ');
            throw new AppError(message, 400);
        }

        const newShow = new Show(req.body.show);
        await newShow.save();
        res.redirect(`/shows/${newShow._id}`);
    } catch (e) {
        next(e);
    }
});

app.get('/shows/:id', async (req, res, next) => {
    try {
        const IdShow = await Show.findById(req.params.id);
        if (!IdShow) {
            throw new AppError("Show not found.", 404);
        }
        res.render('details.ejs', { IdShow });
    } catch (e) {
        next(e);
    }
});

app.get('/shows/:id/edit', async (req, res, next) => {
    try {
        const IdShow = await Show.findById(req.params.id);
        if (!IdShow) {
            throw new AppError("Show not found.", 404);
        }
        res.render('edit.ejs', { IdShow });
    } catch (e) {
        next(e);
    }
});

app.put('/shows/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { error } = validateShow(req.body.show);
        if (error) {
            const message = error.details.map((el) => el.message).join(', ');
            throw new AppError(message, 400);
        }

        const updatedShow = await Show.findByIdAndUpdate(id, { ...req.body.show });
        if (!updatedShow) {
            throw new AppError("Show not found.", 404);
        }
        res.redirect(`/shows/${updatedShow._id}`);
    } catch (e) {
        next(e);
    }
});


app.delete('/shows/:id', async (req, res, next) => {
    try {
        const deletedShow = await Show.findByIdAndDelete(req.params.id);
        if (!deletedShow) {
            throw new AppError("Show not found.", 404);
        }
        res.redirect('/shows');
    } catch (e) {
        next(e);
    }
});

app.get('/home', (req, res) => {
    res.render('home.ejs');
})

class AppError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status || 500;
    }
}

app.use((err, req, res, next) => {
    const { status = 500, message = "Something went wrong." } = err;
    res.status(status).render('error.ejs', { error: { status, message } });
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});