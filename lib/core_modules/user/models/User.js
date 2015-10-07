var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

exports = module.exports = {
    identity: 'user',
    connection: 'mysqlDefault',
    attributes: {
        firstname: {
            type: 'string'
        },
        lastname: {
            type: 'string'
        },
        username: {
            type: 'string',
            unique: true
        },
        userlevel: {
            type: 'integer',
            enum: [1,2,3,4,5,6,7,8,9,10]
        },
        password: {
            type: 'string',
            required: true,
            minLength: 6,
            maxLength: 128
        },
        verifyPassword: function(password) {
            return bcrypt.compareSync(password, this.password);
        },

        changePassword: function(newPassword, cb) {
            this.newPassword = newPassword;
            this.save(function(err, u) {
                return cb(err, u);
            });
        },

        toJSON: function() {
            var obj = this.toObject();
            return obj;
        }
    },
    beforeCreate: function(attrs, cb) {
        bcrypt.hash(attrs.password, SALT_WORK_FACTOR, function(err, hash) {
            attrs.password = hash;
            return cb();
        });
    },

    beforeUpdate: function(attrs, cb) {
        if (attrs.newPassword) {
            bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
                if (err) return cb(err);

                bcrypt.hash(attrs.newPassword, salt, function(err, crypted) {
                    if (err) return cb(err);

                    delete attrs.newPassword;
                    attrs.password = crypted;
                    return cb();
                });
            });
        } else {
            return cb();
        }
    }
}