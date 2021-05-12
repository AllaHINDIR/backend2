//const sendEmail = require('../modules/mail');
const htmlToText = require('html-to-text');
const multer = require('multer');
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Member = require('../model/member');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth');
const path = require('path');
//const Region = require('../model/region');
const generate = require('../middleware/passwordGenerator');
const config = require('../config/env/development');
//const sendEmail2 = require('../modules/mailgun');

const internalIp = require('internal-ip');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join('uploads/images/profile'));
    },
    filename: function (req, file, cb) {
        cb(null, path.join(Date.now().toString() + file.originalname));
    }
})
const storage2 = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join('uploads/images/certifs'));
    },
    filename: function (req, file, cb) {
        cb(null, path.join(Date.now().toString() + file.originalname.trim()));
    }
})
//const upload = multer({storage: storage});


const fileFilter = (req, file, cb) => {
    //reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};
const upload = multer({
    storage: storage, limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});
const upload2 = multer({
    storage: storage2, limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

var smtpTransport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "arram2020emi@gmail.com",
        pass: "azerty123."
    }
});

router.post('/members', upload2.single('certifImage'), (req, res) => {

    const id = new mongoose.Types.ObjectId();
    //const url = req.protocol + "://" + req.get("host");
    var ipv4 = internalIp.v4.sync();
    const url = req.protocol + "://" + ipv4 + ":5000";

    var certifPath = '';
    if (req.file) {
        certifPath = url + "/uploads/images/certifs/" + req.file.filename;

    }
    //let password = generate(10);
    let password = req.body.password;
    //  console.log(password);
    bcrypt.hash(password, 10).then(hash => {
        let member = new Member({
            _id: id,
            indicatif: req.body.indicatif,
            password: hash,
            cin: req.body.cin,
            certifPath: certifPath,
            email: req.body.email,
            phone: req.body.phone,
            adresse: req.body.adresse,
            lastName: req.body.lastName,
            firstName: req.body.firstName,
            //_regionId: req.body.idRegion
        });
        member
            .save()
            .then(result => {
                /*var rand,mailOptions;
                mailOptions={
                    from: '"ARRAM" <arram2020emi@gmail.com>',
                    to : result.email,
                    subject : " Votre inscription a été enregistrée",
                    html : `Bonjour, ${result.firstName} ${result.lastName}
                 <br> bienvenue sur votre espace arram.ma,<br>
               Votre inscription a été enregistrée et elle est en cours de traitement <br>
              Nous vous prions de bien vouloir retrouver ci-après vos identifiants de connexion afin d'y accéder.<br><br>
             <strong> Votre login :</strong>  ${result.indicatif}
              <br> <strong> Votre mot de passe :</strong> ${password} <br>
             <br>En cliquant sur le lien suivant : https://arram-app.herokuapp.com/
               <br> ou en copiant le lien dans votre navigateur <br>
               <br>
              Cordiales 73 <br>
              de CN8MC `
                };*/

                //         sendEmail2({
                //             email: result.email,
                //             subject: " Votre inscription a été enregistrée",
                //             html: `Bonjour, ${result.firstName} ${result.lastName}
                //      <br> bienvenue sur votre espace arram.ma,<br>
                //    Votre inscription a été enregistrée et elle est en cours de traitement <br>
                //   Nous vous prions de bien vouloir retrouver ci-après vos identifiants de connexion afin d'y accéder.<br><br>
                //  <strong> Votre login :</strong>  ${result.indicatif}
                //   <br> <strong> Votre mot de passe :</strong> ${password} <br>
                //  <br>En cliquant sur le lien suivant : https://arram.ma
                //  <br> ou en copiant le lien dans votre navigateur <br>
                //  <br>
                //   Cordiales 73 <br>
                //   de CN8MC `

                //         }).then(results => {

                //             console.log(results);
                //         }).catch(err => {

                //             console.log(err);
                //         });

                /*  smtpTransport.sendMail(mailOptions, function(error, response){
                      if(error){
                          console.log(error);
                          res.end("error");
                      }else{
                          res.status(200).json({
                              message : 'Message sent to '+member.email,
                              result : response
                          });
                      }
                  });*/

                res.status(201).json({
                    message: "Compte crée ! un mail vous a été envoyé",
                    result: result
                });
            })
            .catch(err => {
                res.status(500).json({
                    error: err
                });
            });
    });

});

router.get('/allmembers', (req, res, next) => {
    Member.find().sort({ inscriptionDate: -1 }).then(results => {
        if (results) res.status(200).json(results);
    }).catch(err => {
        if (err) res.status(500).send('error : ' + err);
    })
})

router.get('/members', (req, res, next) => {

    Member.find({ state: 'Accepted' }).sort({ inscriptionDate: -1 }).then(results => {
        if (results) res.status(200).json(results);
    }).catch(err => {
        if (err) res.status(500).send('error : ' + err);
    })

})

router.get('/member/:indicatif', (req, res) => {
    Member.find({ indicatif: req.params.indicatif }, (err, result) => {
        if (err) res.status(500).send('error : ' + err);
        else if (!result) res.status(404).send(`no member with indicatif ${req.params.indicatif}`);
        else res.json(result);
    })
})
router.get('/members/:id', (req, res) => {
    Member.findOne({ _id: req.params.id }, (err, result) => {
        if (err) res.status(500).send('error : ' + err);
        else if (!result) res.status(404).send(`no member with id ${req.params.id}`);
        else {
            res.status(200).json(result);

        }
    })
})

// route for member loging
router.post("/login", (req, res, next) => {
    let fetchedMember;
    Member.findOne({ indicatif: req.body.indicatif, state: "Accepted" })
        .then(member => {
            if (!member) {
                return res.status(401).json({
                    message: "Compte introuvable !"
                });
            }
            fetchedMember = member;
            return bcrypt.compare(req.body.password, member.password);
        })
        .then(result => {
            if (!result) {
                return res.status(401).json({
                    message: "Auth failed"
                });
            }
            if (fetchedMember != undefined){
            const token = jwt.sign({
                memberId: fetchedMember._id
            },
                config.secret,
                { expiresIn: "1h" }
            );
            //  console.log(token);
            res.status(200).json({
                token: token,
                expiresIn: 3600,
                memberId: fetchedMember._id,
                role: fetchedMember.role
            });
        }
        })
        // .catch(err => {
        //     return res.status(401).json({
        //         message: "Erreur de connexion",
        //         error: err
        //     });
        // });
});


// router.post("/login", (req, res) => {
//     console.log(req.body)
//     const indicatif = req.body.indicatif;
//     const password = req.body.password;
//     // Find user by email
//     Member.findOne({ indicatif: indicatif, state: "Accepted" })
//         .then(member => {
//             // Check if user exists
//             if (!member) {
//                 return res.status(404).json({ message: "Compte introuvable !" });
//             }
//             // Check password
//             bcrypt.compare(password, member.password).then(isMatch => {
//                 if (isMatch) {
//                     // User matched
//                     // Create JWT Payload

//                     // Sign token
//                     const token = jwt.sign({
//                         memberId: member._id
//                     },
//                         config.secret,
//                         { expiresIn: "1h" }
//                     );
//                     res.status(200).json({
//                         token: token,
//                         expiresIn: 3600,
//                         memberId: member._id,
//                         role: member.role
//                     });
//                 } else {
//                     return res
//                         .status(400)
//                         .json({ passwordincorrect: "Password incorrect" });
//                 }
//             });
//         });
// });


router.put('/members/password/:indicatif', (req, res) => {

    const indicatif = req.params.indicatif;
    const password = req.body.password;
    console.log('indicatif' + indicatif);
    console.log('password' + password);
    Member.findOne({ indicatif: indicatif }, (err, document) => {
        if (err) res.status(500).send('error : ' + err);
        else if (!document) {
            res.status(404).send(`no member with indicatif ${req.params.indicatif}`);
        }
        else {
            //let password = generate(10);

            bcrypt.hash(password, 10).then(hash => {
                document.password = hash;

                Member.updateOne({ _id: document._id }, document).then(result => {
                    if (result.nModified > 0) {
                        return res.status(200).json({ message: "votre mot de passe a été modifié avec succès! un mail vous a été envoyé" });
                    } else {
                        return res.status(401).json({ message: "Not authorized!" })
                    }
                });
            });

        }

    });
});
router.put('/members/forgotpassword', (req, res) => {
    console.log(req.body.indicatif);
    const indicatif = req.body.indicatif;
    Member.findOne({ indicatif: indicatif }, (err, document) => {
        if (err) res.status(500).send('error : ' + err);
        else if (!document) {
            res.status(404).send(`no member with indicatif ${req.body.indicatif}`);
        }
        else {

            const token = jwt.sign({
                memberId: document._id,
            },
                config.secret
                ,
                { expiresIn: "1d" });
            const url = req.protocol + "://" + req.get("host");

            const resetLink = `<h4> Merci de cliquer sur le lien ci-dessous pour réinitialiser votre mot de passe </h4>
                                   <a href='${url}/#/forgot-password/${token}'>Réinitialiser mot de passe</a>`;
            //  return res.json(resetLink);

            sendEmail2({
                email: document.email,
                subject: 'Réinitialisation de votre mot de passe',
                html: resetLink

            }).then(results => {

                return res.json(results);
            }).catch(err => {

                return res.status(INTERNAL_SERVER_ERROR).json(err);
            })


            /*sendEmail({
                html: resetLink,
                subject: 'Réinitialisation de votre mot de passe',
                email: document.email
            }).then(results => {
                return res.json(results.message);
            }).catch
            (err => {
                return res.status(INTERNAL_SERVER_ERROR).json(err);
            });*/

        }

    });
});
router.put('/members/resetPassword', checkAuth, (req, res) => {

    if (req.memberData) {

        Member.findOne({ _id: req.memberData.memberId }, (err, document) => {
            if (err) res.status(500).send('error : ' + err);
            else if (!document) {
                res.status(404).send(`no member with id ${req.memberData.memberId}`);
            }
            else {
                let newpassword = req.body.password;

                bcrypt.hash(newpassword, 10).then(hash => {
                    document.password = hash;

                    Member.updateOne({ _id: document._id }, document).then(result => {
                        if (result.nModified > 0) {
                            sendEmail2({
                                email: document.email,
                                subject: 'Votre mot de passe a été modifié',
                                html: `Bonjour, <br>
                            ${document.firstName} ${document.lastName} <br>
                            votre mot de passe a été modifié avec succès <br>
                             Pour une aide supplémentaire, visitez notre site sur l'adresse https://arram.live/
                            <br>
                             Cordiales 73 <br>
                            de CN8MC `

                            }).then(results => {

                                console.log(results);
                            }).catch(err => {

                                console.log(err);
                            });
                            /* var rand, mailOptions;
                               mailOptions = {
                                   from : '"ARRAM" <arram2020emi@gmail.com>',
                                   to: document.email,
                                   subject: " Votre mot de passe a été modifié",
                                   html: `Bonjour, <br>
             ${document.firstName} ${document.lastName} <br>
            votre mot de passe a été modifié avec succès <br>
                Pour une aide supplémentaire, visitez notre site sur l'adresse https://arram-app.herokuapp.com/
               <br>
             Cordiales 73 <br>
             de CN8MC `
                               };
                               smtpTransport.sendMail(mailOptions, function (error, response) {
                                   if (error) {
                                       // res.send("error");
                                   } else {
                                       res.status(200).json({
                                           message: 'Message sent to ' + document.email,
                                           result: response
                                       });
                                   }
                               });*/
                            return res.status(200).json({ message: "votre mot de passe a été modifié avec succès! un mail vous a été envoyé" });
                        } else {
                            return res.status(401).json({ message: "Not authorized!" })
                        }
                    });
                });

            }

        });

    }


})
// change password route /members/password/change/
router.put('/members/password/change/:id', checkAuth, (req, res) => {


    Member.findOne({ _id: req.params.id }, (err, document) => {
        if (err) res.status(500).send('error : ' + err);
        else if (!document) {
            res.status(404).send(`no member with id ${req.params.id}`);
        }
        else {
            let newpassword = req.body.password;
            bcrypt.hash(newpassword, 10).then(hash => {
                document.password = hash;

                Member.updateOne({ _id: document._id }, document).then(result => {
                    if (result.nModified > 0) {
                        sendEmail2({
                            email: document.email,
                            subject: 'Votre mot de passe a été modifié',
                            html: `Bonjour, <br>
                            ${document.firstName} ${document.lastName} <br>
                            votre mot de passe a été modifié avec succès <br>
                             Pour une aide supplémentaire, visitez notre site sur l'adresse https://arram.live
                            <br>
                             Cordiales 73 <br>
                            de CN8MC `

                        }).then(results => {

                            console.log(results);
                        }).catch(err => {

                            console.log(err);
                        });

                        /* var rand, mailOptions;
                            mailOptions = {
                                from : '"ARRAM" <arram2020emi@gmail.com>',
                                to: document.email,
                                subject: "Votre mot de passe a été modifié",
                                html: `Bonjour, <br>
              ${document.firstName} ${document.lastName} <br>
             votre mot de passe a été modifié avec succès <br>
             Pour une aide supplémentaire, visitez notre site sur l'adresse https://arram-app.herokuapp.com/
               <br>
              Cordiales 73 <br>
              de CN8MC `
                            };
                            smtpTransport.sendMail(mailOptions, function (error, response) {
                                if (error) {
                                    // res.send("error");
                                } else {
                                    res.status(200).json({
                                        message: 'Message sent to ' + document.email,
                                        result: response
                                    });
                                }
                            });*/
                        return res.status(200).json({ message: "votre mot de passe a été modifié avec succès! un mail vous a été envoyé" });
                    } else {
                        return res.status(401).json({ message: "Not authorized!" })
                    }
                });
            });

        }

    });
});


router.put("/members/:id", checkAuth, upload.single('memberImage'),
    (req, res, next) => {
        let fitchedMember;

        Member.findOne({ _id: req.params.id }, (err, document) => {
            if (err) res.status(500).send('error : ' + err);
            else if (!document) {
                res.status(404).send(`no member with id ${req.params.id}`);
            } else {
                fitchedMember = document;
                let imagePath = req.body.imagePath;
                let member;
                if (req.file) {
                    const url = req.protocol + "://" + req.get("host");
                    imagePath = url + "/uploads/images/profile/" + req.file.filename;
                    member = new Member({
                        _id: req.body.id,
                        imagePath: imagePath,
                        email: req.body.email,
                        phone: req.body.phone,
                        role: fitchedMember.role,
                        lastName: req.body.lastName,
                        firstName: req.body.firstName,
                        adresse: req.body.adresse,
                        //_regionId: req.body.idRegion,
                        state: req.body.state
                    });
                } else {
                    member = new Member({
                        _id: req.body.id,
                        email: req.body.email,
                        phone: req.body.phone,
                        role: fitchedMember.role,
                        lastName: req.body.lastName,
                        firstName: req.body.firstName,
                        adresse: req.body.adresse,
                        //_regionId: req.body.idRegion,
                        state: req.body.state
                    });
                }

                Member.updateOne({ _id: req.params.id }, member).then(result => {
                    if (result.nModified > 0) {
                        res.status(200).json({ message: "Update successful!" });
                    } else {
                        res.status(401).json({ message: "Not authorized!" });
                    }
                });
            }


        })

    });
router.delete("/members/:id", checkAuth, (req, res, next) => {

    Member.deleteOne({ _id: req.params.id }).then(result => {

        if (result.n > 0) {
            res.status(200).json({ message: "Deletion successful!" });
        }

        else {
            res.status(401).json({ message: "Not authorized!" });
        }


    });
});


router.get("/members/tokens/:token", (req, res) => {
    try {
        decoded = jwt.verify(req.params.token, config.secret);
    } catch (e) {
        return res.status(401).send('unauthorized');
    }
    var userId = decoded.memberId;
    // Fetch the user by id
    Member.findOne({ _id: userId }).then(user => {
        res.status(200).send(user);
    });
})
module.exports = router;