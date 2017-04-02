"use strict";
const Logger = rootRequire('src/Helpers/Logger.js');

const BoxHelper = require('./Helper');
const UserHelper = require('./../../UserHelper.js');

module.exports = (app, passport, uploadApp) => {
    let BoxHelperObj = new BoxHelper(uploadApp);
    let UserHelperObj = new UserHelper(uploadApp);


    /*
     const client = BoxHelperObj.createOauthClient({
     "_id": 127251962,
     "provider": "telegram",
     "first_name": "Gregory",
     "last_name": "Goijaerts",
     "username": "gregoryg",
     "avatar": null,
     "accessToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjdiNDBhNzFmMGRiMjhkZTI0M2ZhYmU4NzVmZGU5YmU4MzA1NTAxMGIyZmM2MGU0Njk4YjQ2NTg4MjhjYTE2MjBlMmRlNDhmOTliYTE3YmE3In0.eyJhdWQiOiIxMDAyNSIsImp0aSI6IjdiNDBhNzFmMGRiMjhkZTI0M2ZhYmU4NzVmZGU5YmU4MzA1NTAxMGIyZmM2MGU0Njk4YjQ2NTg4MjhjYTE2MjBlMmRlNDhmOTliYTE3YmE3IiwiaWF0IjoxNDkxMDQyODM0LCJuYmYiOjE0OTEwNDI4MzQsImV4cCI6MTUyMjU3ODgzNCwic3ViIjoiMjY4Iiwic2NvcGVzIjpbImJhc2ljIiwiYXZhdGFyIl19.KQzmMYDtgCkTEflrQ4lp6fYRpwXcZOWE360bmX-6IuIiMlWxMcSYhtEebXgNn_EknRqetevqHrfJBgUIcBH5NbaBxY8pIv1OfGZX_pSA6OO1KxvkHgsHdohXIvmT-VG1HUs5IASaNKvLh7ZRE4d3jb8oW2zhIcadrgszaQ1Sf7tQUs-MqztHXJTmlKuaeSbuf9oh1VCW_8R1Wy57Ljco_JsLlB69Zfct4kcxyiUwzA3S8fI-lw8B_yhEO6YLotHZkFnVtmUJeSIv0Y8qLupk8Yc4K-FqnsRM045LG5l8MRLcnthwtQr-bW0c6v9ZG3SjgfnN1kVAsBKjYy6XeQ8WaRfqZgF-014Sheugl-EuI2Ww2gCagTTF8YTHX1UD_9cuEq-qJqvFbO91yaZyOkonw4EmIoGsdkK1oxn_PlZ9UxGKQsn_tFBWn2VQExZhUNBaSdYIh93Ghe9KG7hY0wawD3VtPQR0FurMTwrkgs2HTDfAyKvG8UuAyNdy_wBUfN5Hg8TuGoo-w7cIH0WBRWM4cC28foZydASh_54VtRAxSGhpTlX-JBy2uU-xDdRRzs7dR7kMuszo__SYW2mPY4Yt8D9A-9X2mPqK5KipJS5fSp_lF85IvNpv3S3ME7KIQ2B96b7IsWwfsaF0ErcJcQD76JRlS9KT91qIBl4UmmBVEqs",
     "provider_sites": {
     "google": {
     "access_token": "ya29.GlwIBB9m5DdRo_IDZv28jdTzJpDGfui-_1l750MMFDet0H_3JjmIZ3QoKMdRdh_sX1m6SxujU7RIO2NsFeAEdHTiF1rsz7lOPvNyPc988X3teQJS9Yej5LHVi_LK_Q",
     "id_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6ImU1NTFhZjlhNWZmZGM3MjZjZDQ1ODY4MGQzZjQzODRhMjZlZmMyMTkifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiaWF0IjoxNDg5MDExMjEzLCJleHAiOjE0ODkwMTQ4MTMsImF0X2hhc2giOiItemJrQno1bnVmV3BmOWFndWhIdzh3IiwiYXVkIjoiMzQ5MTQzMzk4NDU4LThhcmhtaTlrMGdkazhqOG43ZjNsdm9xc2N1MzlxNWNlLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTE1MjA2OTc4MDU4MDk4OTE5NDk4IiwiYXpwIjoiMzQ5MTQzMzk4NDU4LThhcmhtaTlrMGdkazhqOG43ZjNsdm9xc2N1MzlxNWNlLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIn0.CET5mUV0MSdbryaRkEzGNkmD3Ti7aPQkvAjsTVVMF9h6EziY2oO3gRc2BWyxMcd-ANEzk3d8Vc83MPEunoGQMI2BTGCeeB--X5UnnNvWY4cY-nU9TJ7TwDxu697i1X6ELG2xch1IkOZ_MKc8Nck_m6Ikjnyj6IKCnmsN70BvQDW4NXatj0QSN3U9_DXM2YmyK8nfJ91XP4whWycAmcGP4KIhF9rntGeZOGmB39NeZrdHsCOudYZk4p6U37UCIK17UoKcwVxwOnUO2bAts_sfdQIMf3ub6XHjIHVA3wQlTb4fZFvF9PK2TngTDbOtrXOogUzStzv0X0P17FEPPabj2w",
     "token_type": "Bearer",
     "expiry_date": 1489014811642.0,
     "refresh_token": "1/qTIBxW5QhV9CVFBx8ywKbTtzl21vXiIR6tJfPWU1ko4"
     },
     "imgur": {
     "access_token": "026d3838f98ce9542c58694725048c8ac07e3bb0",
     "expires_in": 2419200,
     "expiry_date": 1488319878815.0,
     "token_type": "bearer",
     "scope": null,
     "refresh_token": "5aa4e94388ab297ddafa5d63fe2d0f747e534b1b",
     "account_id": 13149858,
     "account_username": "Crecket"
     },
     "dropbox": {
     "access_token": "NVV-xhqKUvEAAAAAAADuN3TBqqgchE-0FX5wfNhW6sg79vB6ZeyNslPDiqvSmCXi",
     "token_type": "bearer",
     "uid": "50111006",
     "account_id": "dbid:AADGLCD-QPTNseOBodS0vIvIh3AjVSSn9Uc",
     "user_info": {
     "account_id": "dbid:AADGLCD-QPTNseOBodS0vIvIh3AjVSSn9Uc",
     "name": {
     "given_name": "Gregory",
     "surname": "Goijaerts",
     "familiar_name": "Gregory",
     "display_name": "Gregory Goijaerts",
     "abbreviated_name": "GG"
     },
     "email": "crecketgaming@gmail.com",
     "email_verified": true,
     "avatar": "https://dl-web.dropbox.com/account_photo/get/dbid%3AAADGLCD-QPTNseOBodS0vIvIh3AjVSSn9Uc?size=128x128&vers=1426612432060"
     }
     }
     },
     "refreshToken": "XcGpD3lTBjNBMHUota3Jrq46x3Gphv3wO6idR4Lk0HfWUgT/TmS8V/CcN30lSCMFOZ71yar/OhjSYqX5Tuw+tuYToLoMFnYaEgUk9S5iHU3W/3vzOOV76wQboAcUD6JEUFbMxR+xbToRv5ZpZzv6L+DVSptNiSiCzbXktfP2pYcRpsZncbSJ+0wuOp5YaoOFN/34kPoXKYGyootmiDOjF8PzAEMhl6E1sCg9KiYrJzo0kDTwIxy95q8uSwES9CmULE6PpxhXisgfMRFB/4lZwYGygcoUo9yjBB+7OKcVYKKSxxa54xrJZeVadpwdh0PXnH3iq8xNZ3v9nzd434BCNs1bYIXupDe07Ecmj+sUAHeVcedHNbScNYzegstI+SRF6rF5Ch+48wbfNU3e+GX3JKTf1MF+VKYbal0toAfWcKwJJv0ncDUUdc4SF1iwIHvoNHbT0qFVZGKTsBdqm/65PJwjDdz6X3VIECH8u7XAX68KorpnKa6VziEVYAsjFqy/w7U1jIrPQNDuVrbuyJe1HH+AVh1AxJ+F4GZ7XEQD321BqfGMbgmGRSvts2HJuRBca1FZJLeA/hb55Fs3n2IYUCcK/mnfokFTYbSB0KtVeh4tp6X/fug1wS72mfIztOXccOMwg2sqrPWX/hmY0UTD670oU5/n1P84pfyYiJgWCwg="
     })
     .then(BoxClient => {
     Logger.debug(BoxClient);
     })
     .catch(err => {
     Logger.error(err);
     });
     //*/

    // returns a valid oauth url for the client
    app.post('/login/box', (request, response) => {
        // return response.redirect('/');
        if (!request.user) {
            // not logged in
            return response.redirect('/');
        }

        // check if we already have data for imgur
        if (request.user.provider_sites.box) {
            // check if we have a refresh token
            if (request.user.provider_sites.box.refresh_token) {
                // no need to login for this user
                return response.redirect('/');
            }
        }

        // redirect to imgur login url
        response.redirect(BoxHelperObj.getAuthorizationUrl());
    });

    // handles the oauth callback
    app.get('/login/box/callback', function (request, response) {
        // return response.redirect('/');
        let code = request.query.code;
        let resultRoute = "/new/box";

        // make sure we have a code and we're logged in
        if (!code || !request.user) {
            response.redirect(resultRoute);
            return;
        } else {
            // get access token for given code
            BoxHelperObj.requestAccessToken(code)
                .then((result) => {
                    let responseData = result;

                    // set new data
                    request.user.provider_sites.box = {};
                    request.user.provider_sites.box = {
                        accessToken: responseData.accessToken,
                        refreshToken: responseData.refreshToken,
                        accessTokenTTLMS: responseData.accessTokenTTLMS,
                        acquiredAtMS: responseData.acquiredAtMS,
                        expiry_date: (new Date()).getTime() + parseInt(responseData.accessTokenTTLMS / 1000),
                    };

                    // create a client to fetch the user info
                    BoxHelperObj.createOauthClient(request.user)
                        .then(BoxClient => {
                            // get user info for current user
                            BoxClient.users.get("me", null,
                                (err, currentUser) => {
                                    if (err) {
                                        Logger.error(err);
                                        return response.redirect(resultRoute);
                                    }

                                    // store the new user info
                                    request.user.provider_sites.box.user_info = currentUser;

                                    // update the tokens for this user
                                    UserHelperObj.updateUserTokens(request.user)
                                        .then((result) => {
                                            response.redirect(resultRoute);
                                        })
                                        .catch((err) => {
                                            response.redirect(resultRoute);
                                        });
                                }
                            );
                        })
                        .catch(err => {
                            Logger.error(err);
                            response.redirect(resultRoute);
                        });
                })
                .catch((err) => {
                    Logger.error(err);
                    response.redirect(resultRoute);
                });
        }
    });

}
