var CT = require('./modules/country-list');
var AM = require('./modules/account-manager');
var EM = require('./modules/email-dispatcher');
var del = require('./modules/del.js');
var fs = require('fs');
var path = require('path');
var moment = require("moment");







// 




module.exports = function(app) {




app.get('/week', function(req, res) {

    
                
            AM.getproduct('week',function(e, products) {
                res.render('pages/week', {
                    title: 'Account List',
                    accts:products
                   
                     
                });

            });


    });



app.get('/', function(req, res) {
                    
            AM.getproduct('xmas',function(e, products) {
                res.render('pages/xmas', {
                    title: 'Account List',
                    accts:products
                   
                     
                });

            });

      

    });

app.get('/xmas', function(req, res) {
                    
  
res.redirect('/');
    });





   

          app.get("/alter",function(req,res){
            if (req.session.user.user == "admin") {

                 res.render('alter',{title:'visble'});
            }else{
                res.redirect('/');

            }


       


    });

   
//

    app.get("/updatealter",function(req,res){

        res.render('updatealter',{title:'visble'});


    });



//



    app.post('/test', function(req, res) {


        AM.addproduct({
            post:req.body.post,
            title: req.body['title'],
            content: req.body['content'],
            vurl: req.body['videosrc'],
            iurl: req.body['imgsrc'],
            lurl: req.body['linksrc'],
            status: 'processing',
            count:0,
            share:0,
            time:moment().format("YYYY/MM/DD"),
            user: req.session.user.user

        }, function(e) {
            if (e) {
                res.status(400).send(e);
            } else {
                res.status(200).redirect('/product');
            }
        });


    });







    app.get('/sharefb/:slug', function(req, res,next ) {

        

        AM.addshare(req.params.slug, function(e, o) {
        
            next();
        });
      
    });


    app.get('/sharefb/:slug', function(req, res) {


                // res.writeHead(302, {Location: encodeURI('http://www.facebook.com/sharer.php?u=http://blog.igift.tw/post/聖誕示你的愛 愛的手工小書')});

                res.redirect("http://www.facebook.com/sharer.php?u=http://blog.igift.tw/post/"+encodeURIComponent(req.params.slug));

    });


    app.get('/sharele/:slug', function(req, res,next ) {

        

        AM.addshare(req.params.slug, function(e, o) {
        
            next();
        });
      
    });


    app.get('/sharele/:slug', function(req, res) {
                // res.writeHead(302, {Location: encodeURI('http://www.facebook.com/sharer.php?u=http://blog.igift.tw/post/聖誕示你的愛 愛的手工小書')});

                    // var place=req.params.slug;
                    // place=place.replace(/ /g,"%20")

                res.redirect("http://line.naver.jp/R/msg/text/?http://blogec.igift.tw/post/"+encodeURIComponent(req.params.slug));

    });


 





    app.get('/product', function(req, res) {
        if (req.session.user.user == "admin") {
            // if user is not logged-in redirect back to login page //
           
AM.getproductRecords(function(e, products) {
                res.render('product', {
                    title: 'Account List',
                    accts: products
                });

            });

        } else {

                 res.redirect('/')
            

        }
    });

       app.get('/edit/:post', function(req, res) {
        if (req.session.user == null) {
            // if user is not logged-in redirect back to login page //
            res.redirect('/')
        } else {

            AM.getproduct(req.params.post,function(e, products) {
                res.render('product', {
                    title: 'Account List',
                    accts: products
                });

            });

        }
    });




    app.get('/productal/:id', function(req, res) {
        if (req.session.user.user == 'admin') {
            // if user is not logged-in redirect back to login page //
           
            
            AM.upx(req.params.id,function(e, o) {
                res.render('updatealter',{
                    product:o

                });
            });

        } else {

            res.redirect('/');

        }
    });

    




        
    app.get('/del/:id', function(req, res){
       
        
        AM.deleteAccount(req.params.id, function(e, obj){
            if (!e){
                res.clearCookie('user');
                res.clearCookie('pass');
                req.session.destroy(function(e){ res.status(200).redirect('/home'); });
            }   else{
                res.status(400).send('record not found');
            }
        

        });

    }); 

    app.get("/delpic/:filename", function(req, res) {
    
    // app/public/files/filename
    // app/server/routes.js
    var filepath = path.join(__dirname, '..', 'public', 'files', req.params.filename)

    fs.unlink(filepath, function(err) {
        if (err){

         console.error(err);
         res.status(400).send('error');
        } else{

        res.redirect('/product');
        }
    });

});



    app.get('/delproduct/:id', function(req, res) {
        // req.query.id = req.params.id;
        if (req.session.user.user == 'admin') {

            AM.deleteproduct(req.params.id, function(e, obj) {
            if (!e) {


                res.status(200).redirect('/product');

            } else {
                res.status(400).send('record not found');
            }


        });


        }else{

            res.redirect('/')



        }


        

    });



    // app.get('/data', function(req, res) {
    //     res.render('data', {
    //         title: 'Signup',
    //         countries: CT
    //     });
    //     console.log('data-k');
    // });


    // app.post('/data', function(req, res) {
    //     AM.addNewAccount({
    //         name: req.body['name'],
    //         email: req.body['email'],
    //         user: req.body['user'],
    //         pass: req.body['pass'],
    //         user_url:"none",
    //         country: req.body['country']
    //     }, function(e) {
    //         if (e) {
    //             res.status(400).send(e);
    //         } else {
    //             res.status(200).send('ok');
    //         }
    //     });
    // });


    // main login page //

    app.get('/login', function(req, res) {
        // check if the user's credentials are saved in a cookie //
        if (req.cookies.user == undefined || req.cookies.pass == undefined) {
            res.render('login', {
                title: 'Hello - Please Login To Your Account'
            });
        } else {
            // attempt automatic login //
            AM.autoLogin(req.cookies.user, req.cookies.pass, function(o) {
                if (o != null) {
                    req.session.user = o;
                    res.redirect('/home');
                } else {
                    res.render('login', {
                        title: 'Hello - Please Login To Your Account'
                    });
                }
            });
        }
    });

    app.post('/login', function(req, res) {
        AM.manualLogin(req.body['user'], req.body['pass'], function(e, o) {
            if (!o) {
                res.status(400).send(e);
            } else {
                req.session.user = o;
                if (req.body['remember-me'] == 'true') {
                    res.cookie('user', o.user, {
                        maxAge: 900000
                    });
                    res.cookie('pass', o.pass, {
                        maxAge: 900000
                    });
                }
                res.status(200).send(o);
            }
        });
    });

    // logged-in user homepage //

    app.get('/home', function(req, res) {
        if (req.session.user == null) {
            // if user is not logged-in redirect back to login page //
            res.redirect('/');
        } else {
            res.render('home', {
                title: 'Control Panel',
                countries: CT,
                udata: req.session.user
            });
        }

    });





    app.post('/home', function(req, res) {
        if (req.body['user'] != undefined) {
            AM.updateAccount({
                user: req.body['user'],
                name: req.body['name'],
                email: req.body['email'],
                pass: req.body['pass'],
                userurl:req.body['userurl'],
                country: req.body['country']
            }, function(e, o) {
                if (e) {
                    res.status(400).send('error-updating-account');
                } else {
                    req.session.user = o;
                    // update the user's login cookies if they exists //
                    if (req.cookies.user != undefined && req.cookies.pass != undefined) {
                        res.cookie('user', o.user, {
                            maxAge: 900000
                        });
                        res.cookie('pass', o.pass, {
                            maxAge: 900000
                        });
                    }
                    res.status(200).send('ok');
                }
            });
        } else if (req.body['logout'] == 'true') {
            res.clearCookie('user');
            res.clearCookie('pass');
            req.session.destroy(function(e) {
                res.status(200).send('ok');
            });
        }
    });



  app.get('/phome', function(req, res) {
        if (req.session.user == null) {
            // if user is not logged-in redirect back to login page //
            res.redirect('/');
        } else {
                AM.getproductRecords(function(e, products) {
                res.render('alter', {
                    title: 'Account List',
                    accts: products
                });

            });

        }

    });




app.post('/phome/:id', function(req, res) {
        
        
            AM.updateproduct(req.params.id,{
                title: req.body['title'],
                content: req.body['content'],
                vurl: req.body['videosrc'],
                iurl: req.body['imgsrc'],
                linkurl: req.body['linksrc'],
                time:req.body.time


            }, function(e, o) {
                if (e) {
                    res.status(400).send('error-updating-account');
                } else {
                    req.session.user = o;
                    // update the user's login cookies if they exists //
                    if (req.cookies.user != undefined && req.cookies.pass != undefined) {
                        res.cookie('user', o.user, {
                            maxAge: 900000
                        });
                        res.cookie('pass', o.pass, {
                            maxAge: 900000
                        });
                    }
                    res.status(200).redirect("/product");
                }
            });



      
    });
   




    //implement//




    //ALTER //
    // creating new accounts //

    app.get('/signup', function(req, res) {
        res.render('signup', {
            title: 'Signup',
            countries: CT
        });
    });

    app.post('/signup', function(req, res) {
        AM.addNewAccount({
            name: req.body['name'],
            email: req.body['email'],
            user: req.body['user'],
            pass: req.body['pass'],
            userurl:req.body['userurl'],
            country: req.body['country']
        }, function(e) {
            if (e) {
                res.status(400).send(e);
            } else {
                res.status(200).send('ok');
            }
        });
    });









    app.get('/post/:slug', function(req, res,next) {

     

  
        //    if user is not logged-in redirect back to login page //
            AM.addone(req.params.slug, function(e, o) {


            if (e) {

                console.log(e);
                next();

            } else {
                next();
            }



        });



    });



app.get('/post/:slug', function(req, res) {


      
                
            AM.getproduct(req.params.slug,function(e, products) {
                res.render('pages/story', {
                    title: 'Account List',
                    accts: products
                     
                });

            });

        

    });












    // password reset //

    app.post('/lost-password', function(req, res) {
        // look up the user's account via their email //
        AM.getAccountByEmail(req.body['email'], function(o) {
            if (o) {
                EM.dispatchResetPasswordLink(o, function(e, m) {
                    // this callback takes a moment to return //
                    // TODO add an ajax loader to give user feedback //
                    if (!e) {
                        res.status(200).send('ok');
                    } else {
                        for (k in e) console.log('ERROR : ', k, e[k]);
                        res.status(400).send('unable to dispatch password reset');
                    }
                });
            } else {
                res.status(400).send('email-not-found');
            }
        });
    });

    app.get('/reset-password', function(req, res) {
        var email = req.query["e"];
        var passH = req.query["p"];
        AM.validateResetLink(email, passH, function(e) {
            if (e != 'ok') {
                res.redirect('/');
            } else {
                // save the user's email in a session instead of sending to the client //
                req.session.reset = {
                    email: email,
                    passHash: passH
                };
                res.render('reset', {
                    title: 'Reset Password'
                });
            }
        })
    });

    app.post('/reset-password', function(req, res) {
        var nPass = req.body['pass'];
        // retrieve the user's email from the session to lookup their account and reset password //
        var email = req.session.reset.email;
        // destory the session immediately after retrieving the stored email //
        req.session.destroy();
        AM.updatePassword(email, nPass, function(e, o) {
            if (o) {
                res.status(200).send('ok');
            } else {
                res.status(400).send('unable to update password');
            }
        })
    });

    // view & delete accounts //







    app.get('/print', function(req, res) {

        if (req.session.user.user == "admin") {
            // if user is not logged-in redirect back to login page //
           
                     AM.getAllRecords(function(e, accounts) {
                res.render('print', {
                    user:req.session.user.user,
                    img:req.session.user.userurl,
                    title: 'Account List',
                    accts: accounts,
                    url: '/uploads/login.png'
                });
            })
        

        }
            
         else {
                res.redirect('/');
            }

    });





    app.post('/delete', function(req, res) {
        AM.deleteAccount(req.body.id, function(e, obj) {
            if (!e) {
                res.clearCookie('user');
                res.clearCookie('pass');
                req.session.destroy(function(e) {
                    res.status(200).send('ok');
                });
            } else {
                res.status(400).send('record not found');
            }
        });
    });

    app.get('/reset', function(req, res) {
        AM.delAllRecords(function() {
            res.redirect('/print');
        });
    });



        app.get('/resetp', function(req, res) {
            if (req.session.user.user == "admin") {

 AM.delAllProductsRecords(function() {
            res.redirect('/product');
        });

            }else{redirect('/');

        }



    });

    app.get('*', function(req, res) {
        res.render('404', {
            title: 'Page Not Found'
        });
    });

};
