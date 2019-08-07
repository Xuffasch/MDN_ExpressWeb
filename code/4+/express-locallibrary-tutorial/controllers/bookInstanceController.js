var Book = require('../models/book');
var BookInstance = require('../models/bookinstance');

const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator');

exports.bookinstance_list = function(req, res, next) {
    BookInstance.find()
      .populate('book')
      .exec(function (err, list_bookinstances) {
        if (err) { return next(err); }
        res.render('bookinstance_list', {title: 'Book Instances', bookinstance_list: list_bookinstances})
      });
};

exports.bookinstance_detail = function(req, res, next) {
    BookInstance.findById(req.params.id)
        .populate('book')
        .exec(function (err, bookinstance) {
            if (err) { return next(err); }
            if (bookinstance == null) {
                var err = Error('Book copy not found');
                err.status = 404;
                return next(err);
            }
            res.render('bookinstance_detail', {title: "Copy: " + bookinstance.book.title, bookinstance: bookinstance});
        })
};

exports.bookinstance_create_get = function(req, res, next) {
    Book.find({}, 'title')
    .exec(function (err, books) {
      if (err) { return next(err); }
      // Render because of successful search
      res.render('bookinstance_form', { title: 'Create Book', book_list: books});
    });
};

exports.bookinstance_create_post = [
    // Validate fields.
    body('book', 'Book must be specified').isLength({ min: 1 }).trim(),
    body('imprint', 'Imprint must be specified').isLength({ min: 1 }).trim(),
    body('due_back', 'Invalid date').optional({ checkFalsy: true }).isISO8601(),

    // Sanitize fields.
    sanitizeBody('book').escape(),
    sanitizeBody('imprint').escape(),
    sanitizeBody('status').trim().escape(),
    sanitizeBody('due_back').toDate(),

    // Process request after validation and sanitization.
    (req, res, next) => {
        // Extract the valiation errors from a request
        const errors = validationResult(req);

        var bookinstance = BookInstance (
            {
                book: req.body.book,
                imprint: req.body.imprint,
                status: req.body.status,
                due_back: req.body.due_back
            }
        );

        if (!errors.isEmpty()) {
            Book.find({}, 'title')
            .exec(function (err, books) {
                if (err) { return next(err); }
                // Search success. page is rendered
                res.render('bookinstance_form', {title: "Create BookInstance", 
                                                 book_list: books, 
                                                 selected_book: bookinstance.book._id, 
                                                 errors: errors.array(), 
                                                 bookinstance: bookinstance });

            });
            return;
        } else {
            // Data is valid, bookinstance is saved.
            bookinstance.save( function (err) {
                if (err) { return next(err); }
                // Successful save, redirect to new Bookinstance page.
                res.redirect(bookinstance.url);
            });
        }

    }

];

exports.bookinstance_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: BookInstance delete GET');
};

exports.bookinstance_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: BookInstance delete POST');
};

exports.bookinstance_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: BookInstance update GET');
};

exports.bookinstance_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: BookInstance update POST');
};