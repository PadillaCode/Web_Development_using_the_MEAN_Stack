// declare and initialize variables
var mongoose = require('mongoose'),
    bcrypt = require('bcrypt-nodejs'),

    // define the schema
    userSchema = mongoose.Schema({
        // SCHEMA HERE
        local: {

            /*
             * ACCOUNT TYPES
             * super = 0
             * manager = 1
             * admin = 2
             * publisher = 3
             * editor = 4
             * author = 5
             * platinum = 6
             * gold = 7
             * standard = 8
             * registered = 9
             */
            account_type: {type: Number, required: true},
            email: {type: String, required: true, unique: true},
            password: {type: String, required: true, unique: false},
            handle: {type: String, required: true, unique: true}
        },
        social: {
            facebook: {
                username: {type: String, required: false},
                password: {type: String, required: false},
                url: {type: String, required: false}
            },
            twitter: {
                username: {type: String, required: false},
                password: {type: String, required: false},
                url: {type: String, required: false}
            },
            google: {
                username: {type: String, required: false},
                password: {type: String, required: false},
                url: {type: String, required: false}
            },
            youtube: {
                username: {type: String, required: false},
                password: {type: String, required: false},
                url: {type: String, required: false}
            },
            foursquare: {
                username: {type: String, required: false},
                password: {type: String, required: false},
                url: {type: String, required: false}
            },
            lifejournal: {
                username: {type: String, required: false},
                password: {type: String, required: false},
                url: {type: String, required: false}
            },
            skype: {
                username: {type: String, required: false},
                password: {type: String, required: false},
                url: {type: String, required: false}
            },
            yelp: {
                username: {type: String, required: false},
                password: {type: String, required: false},
                url: {type: String, required: false}
            },
            flickr: {
                username: {type: String, required: false},
                password: {type: String, required: false},
                url: {type: String, required: false}
            },
            other: {
                company: {type: String, required: false},
                website: {type: String, required: false},
                api: {type: String, required: false},
                username: {type: String, required: false},
                password: {type: String, required: false},
                url: {type: String, required: false}
            }
        },
        user_profile: {
            sex: {type: String, required: false},
            dob: {type: Date, required: false},
            created: {type: Date, required: false},
            updated: {type: Date, required: false},
            name: {
                prefix: {type: String, required: false},
                first: {type: String, required: false},
                middle: {type: String, required: false},
                last: {type: String, required: false},
                suffix: {type: String, required: false}
            },
            address: {
                street: {type: String, required: false},
                city: {type: String, required: false},
                state: {type: String, required: false},
                zip: {type: String, required: false}
            },
            phone: {
                cell: {type: String, required: false},
                home: {type: String, required: false},
                work: {type: String, required: false},
                fax: {type: String, required: false}
            }
        }
    });

// methods
// generate a hash
userSchema.methods.generateHash = function (password) {
    'use strict';
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// check if password is valid
userSchema.methods.validPassword = function (password) {
    'use strict';
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to the app
module.exports = mongoose.model('User', userSchema);