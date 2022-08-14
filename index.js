// import React, { useEffect, useState } from 'react';
const axios = require("axios");
const fetch = require("cross-fetch");

const bodyParser = require('body-parser');
const express = require('express')
const app = express()
const mysql = require('mysql2')
const cors = require("cors")

let PORT = process.env.PORT || 3001;

// const [dat,setDat] = useState([])


// const db = mysql.createPool({
//     host: "localhost",
//     user: "root",
//     password: "Pioneer072",
//     database: "new_schema",

// });
const db = mysql.createPool({
    host: "162.214.155.142",
    user: "nizayosl_kawsad",
    password: "Pioneer072",
    database: "nizayosl_new_table",

});
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/api/get", (req, res) => {
    const sqlGet = "SELECT * FROM 2022_table";
    let ful = req._parsedUrl.query.split('&');
    let q = '';
    console.log(ful);
    for (let n = 0; n < ful.length; n++) {

        q = ful[n].split('=');
        console.log(q)

        if (q[0] == 'aleague' && ful[n + 1].split('=')[0] == 'aseason' && ful[n + 2].split('=')[0] == 'ateam') {
            console.log('yes', ful[n + 1].split('=')[1], decodeURI(ful[n + 2].split('=')[1]), decodeURI(q[1]));


            const sl = `SELECT * FROM ${ful[n + 1].split('=')[1]}_table WHERE league = '${decodeURI(q[1])}' AND (team2 = '${decodeURI(ful[n + 2].split('=')[1])}' OR team1 = '${decodeURI(ful[n + 2].split('=')[1])}');`
            db.query(sl, (error, result) => {


                res.send(result)


            })


        }


        if (q[0] == 'team') {
            const sl = `SELECT * FROM 2022_table WHERE team2 = '${decodeURI(q[1])}' OR team1 = '${decodeURI(q[1])}';`
            db.query(sl, (error, result) => {


                res.send(result)


            })

        }

        if (q[0] == 'season') {
            console.log('season is ', q[1]);
            h = ful[n + 1].split('=');
            console.log('h', h)
            if (h[0] == 'league') {
                let k1 = []
                let ob = []
                const sl = `SELECT DISTINCT gameid,team1 FROM ${q[1]}_table WHERE league = '${decodeURI(h[1])}';`
                for (let index = 0; index < decodeURI(h[1]).length; index++) {
                    ob.push(decodeURI(h[1]).charCodeAt(index))

                }
                console.log('char inex', decodeURI(h[1]), ob);
                db.query(sl, (error, result) => {

                    console.log(result);

                    for (let o = 0; o < result.length; o++) {
                        k1.push(result[o].team1)

                    }




                })

                const s2 = `SELECT DISTINCT gameid,team2 FROM ${q[1]}_table WHERE league = '${decodeURI(h[1])}';`
                db.query(s2, (error, result2) => {

                    console.log(result2);
                    for (let index = 0; index < result2.length; index++) {
                        k1.push(result2[index].team2)

                    }

                    k1 = [...new Set(k1)];



                    res.send(k1)


                })


            }

        }

        if (q[0] == 'league_list') {
            const sl = `SELECT DISTINCT league FROM ${q[1]}_table;`
            db.query(sl, (error, result) => {

                console.log(result);
                res.send(result)


            })

        }
        if (q[0] == 'test') {
           res.send('page is ok')

        }
    }





})

let club = []



let datt = []
let temp = []
let dat_finale = []
let k = 0
//add_for();

function add_for() {

    let lisc = []
    const sl = 'SELECT gameid,team1,team2 FROM 2021_table;'
    db.query(sl, (error, result) => {
        console.log('in', result.length);



        setValues(result)


    })



}
async function setValues(valus) {
    lisc = valus
    for (let l = 0; l <= 1000; l++) {

        console.log(lisc[l].gameid);
       
            await axios.get(`https://api-v2.swissunihockey.ch/api/game_events/${lisc[l].gameid}`)
                .then(data2 => {
                    data2 = data2.data
                    console.log(data2);
                    let team1_val = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                    let team2_val = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

                    if (data2.data.regions[0].rows.length == 0) {
                        console.log('no', l);
                    }
                    else {
                        for (let h = 0; h < data2.data.regions[0].rows.length; h++) {
                            console.log(l, h, lisc[l].gameid, data2.data.regions[0].rows[h].cells[1].text[0]);

                            if (lisc[l].gameid, data2.data.regions[0].rows[h].cells[1].text[0].includes('Torschütze')) {
                                let jk = data2.data.regions[0].rows[h].cells[0].text[0]

                                jk = jk.split(':')

                                console.log(h, "string.", 'score', data2.data.regions[0].rows[h].cells[0].text[0], data2.data.regions[0].rows[h].cells[2].text[0].replaceAll(' ', ''), 'team1', lisc[l].team1.replaceAll(' ', ''), 'team2', lisc[l].team2.replaceAll(' ', ''));
                                if (data2.data.regions[0].rows[h].cells[2].text[0].replaceAll(' ', '') == lisc[l].team1.replaceAll(' ', '') || data2.data.regions[0].rows[h].cells[2].text[0].replaceAll(' ', '').includes(lisc[l].team1.replaceAll(' ', '')) || lisc[l].team1.replaceAll(' ', '').includes(data2.data.regions[0].rows[h].cells[2].text[0].replaceAll(' ', ''))) {
                                    console.log('t1', parseFloat(jk[0]));
                                    if (parseFloat(jk[0]) >= 60) {
                                        console.log('t1>60', parseFloat(jk[0]));
                                        team1_val[0] += 1
                                    }
                                    else if (60 > parseFloat(jk[0]) && parseFloat(jk[0]) >= 55) {
                                        console.log('t1>55', parseFloat(jk[0]));
                                        team1_val[1] += 1
                                    }

                                    else if (55 > parseFloat(jk[0]) && parseFloat(jk[0]) >= 50) {
                                        console.log('t1>50', parseFloat(jk[0]));
                                        team1_val[2] += 1
                                    }
                                    else if (50 > parseFloat(jk[0]) && parseFloat(jk[0]) >= 45) {
                                        console.log('t1>45', parseFloat(jk[0]));
                                        team1_val[3] += 1
                                    }
                                    else if (45 > parseFloat(jk[0]) && parseFloat(jk[0]) >= 40) {
                                        console.log('t1>40', parseFloat(jk[0]));
                                        team1_val[4] += 1
                                    }
                                    else if (40 > parseFloat(jk[0]) && parseFloat(jk[0]) >= 35) {
                                        console.log('t1>35', parseFloat(jk[0]));
                                        team1_val[5] += 1
                                    }
                                    else if (35 > parseFloat(jk[0]) && parseFloat(jk[0]) >= 30) {
                                        console.log('t1>30', parseFloat(jk[0]));
                                        team1_val[6] += 1
                                    }
                                    else if (30 > parseFloat(jk[0]) && parseFloat(jk[0]) >= 25) {
                                        console.log('t1>25', parseFloat(jk[0]));
                                        team1_val[7] += 1
                                    }
                                    else if (25 > parseFloat(jk[0]) && parseFloat(jk[0]) >= 20) {
                                        console.log('t1>20', parseFloat(jk[0]));
                                        team1_val[8] += 1
                                    }
                                    else if (20 > parseFloat(jk[0]) && parseFloat(jk[0]) >= 15) {
                                        console.log('t1>15', parseFloat(jk[0]));
                                        team1_val[9] += 1
                                    }
                                    else if (15 > parseFloat(jk[0]) && parseFloat(jk[0]) >= 10) {
                                        console.log('t1>10', parseFloat(jk[0]));
                                        team1_val[10] += 1
                                    }
                                    else if (10 > parseFloat(jk[0]) && parseFloat(jk[0]) >= 5) {
                                        console.log('t1>5', parseFloat(jk[0]));
                                        team1_val[11] += 1
                                    }
                                    else {
                                        console.log('t1<5', parseFloat(jk[0]));
                                        team1_val[12] += 1
                                    }





                                }
                                else if (data2.data.regions[0].rows[h].cells[2].text[0].replaceAll(' ', '') == lisc[l].team2.replaceAll(' ', '') || data2.data.regions[0].rows[h].cells[2].text[0].replaceAll(' ', '').includes(lisc[l].team2.replaceAll(' ', '')) || lisc[l].team2.replaceAll(' ', '').includes(data2.data.regions[0].rows[h].cells[2].text[0].replaceAll(' ', ''))) {
                                    console.log('t2', parseFloat(jk[0]));
                                    if (parseFloat(jk[0]) >= 60) {
                                        console.log('t2>60', parseFloat(jk[0]));
                                        team2_val[0] += 1

                                    }
                                    else if (60 > parseFloat(jk[0]) && parseFloat(jk[0]) >= 55) {
                                        console.log('t2>55', parseFloat(jk[0]));
                                        team2_val[1] += 1
                                    }

                                    else if (55 > parseFloat(jk[0]) && parseFloat(jk[0]) >= 50) {
                                        console.log('t2>50', parseFloat(jk[0]));
                                        team2_val[2] += 1
                                    }
                                    else if (50 > parseFloat(jk[0]) && parseFloat(jk[0]) >= 45) {
                                        console.log('t2>45', parseFloat(jk[0]));
                                        team2_val[3] += 1
                                    }
                                    else if (45 > parseFloat(jk[0]) && parseFloat(jk[0]) >= 40) {
                                        console.log('t2>40', parseFloat(jk[0]));
                                        team2_val[4] += 1
                                    }
                                    else if (40 > parseFloat(jk[0]) && parseFloat(jk[0]) >= 35) {
                                        console.log('t2>35', parseFloat(jk[0]));
                                        team2_val[5] += 1
                                    }
                                    else if (35 > parseFloat(jk[0]) && parseFloat(jk[0]) >= 30) {
                                        console.log('t2>30', parseFloat(jk[0]));
                                        team2_val[6] += 1
                                    }
                                    else if (30 > parseFloat(jk[0]) && parseFloat(jk[0]) >= 25) {
                                        console.log('t2>25', parseFloat(jk[0]));
                                        team2_val[7] += 1
                                    }
                                    else if (25 > parseFloat(jk[0]) && parseFloat(jk[0]) >= 20) {
                                        console.log('t2>20', parseFloat(jk[0]));
                                        team2_val[8] += 1
                                    }
                                    else if (20 > parseFloat(jk[0]) && parseFloat(jk[0]) >= 15) {
                                        console.log('t2>15', parseFloat(jk[0]));
                                        team2_val[9] += 1
                                    }
                                    else if (15 > parseFloat(jk[0]) && parseFloat(jk[0]) >= 10) {
                                        console.log('t2>10', parseFloat(jk[0]));
                                        team2_val[10] += 1
                                    }
                                    else if (10 > parseFloat(jk[0]) && parseFloat(jk[0]) >= 5) {
                                        console.log('t2>5', parseFloat(jk[0]));
                                        team2_val[11] += 1
                                    }
                                    else {
                                        console.log('t2<5', parseFloat(jk[0]));
                                        team2_val[12] += 1
                                    }



                                }

                            } else {
                                console.log(h, "not in the string.");
                            }

                        }

                        console.log(team1_val);
                        console.log(team2_val);


                        const sqlIn = `UPDATE 2021_table SET t1_60 = ${team1_val[0]},t1_55 = ${team1_val[1]},t1_50 = ${team1_val[2]},t1_45 = ${team1_val[3]},t1_40 = ${team1_val[4]},t1_35 = ${team1_val[5]},t1_30 = ${team1_val[6]},t1_25 = ${team1_val[7]},t1_20 = ${team1_val[8]},t1_15 = ${team1_val[9]},t1_10 = ${team1_val[10]},t1_5 = ${team1_val[11]},t1_0 = ${team1_val[12]} WHERE gameid = ${lisc[l].gameid};`
                        db.query(sqlIn, (err, result) => {
                            if (err) {


                                console.log('kn');
                            }
                            else {


                                console.log('kn32');

                            }
                        })

                        const sqlIn2 = `UPDATE 2021_table SET t2_60 = ${team2_val[0]},t2_55 = ${team2_val[1]},t2_50 = ${team2_val[2]},t2_45 = ${team2_val[3]},t2_40 = ${team2_val[4]},t2_35 = ${team2_val[5]},t2_30 = ${team2_val[6]},t2_25 = ${team2_val[7]},t2_20 = ${team2_val[8]},t2_15 = ${team2_val[9]},t2_10 = ${team2_val[10]},t2_5 = ${team2_val[11]},t2_0 = ${team2_val[12]} WHERE gameid = ${lisc[l].gameid};`
                        db.query(sqlIn2, (err, result) => {
                            if (err) {


                                console.log('kn');
                            }
                            else {


                                console.log('kn32');

                            }
                        })

                        team1_val = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                        team2_val = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]


                    }

                })
            .catch(error=>{
                console.log(error);
            })



        // const sqlIn = `UPDATE 2021_table SET t = ${l},test2 = 'add' WHERE gameid = ${result[l].gameid};`
        // db.query(sqlIn, [temp], (err, result) => {
        //     if (err) {


        //         console.log('kn');
        //     }
        //     else {


        //         console.log('kn32');

        //     }
        // })





        // const sqlIn = `UPDATE 2021_table SET test = ${l},test2 = 'add' WHERE gameid = ${result[l].gameid};`
        // db.query(sqlIn, [temp], (err, result) => {
        //     if (err) {


        //         console.log('kn');
        //     }
        //     else {


        //         console.log('kn32');

        //     }
        // })

    }

    console.log('END');
}

// async function setValues(valus) {
//     lisc = valus
//     for (let l = 0; l <= 100; l++) {

//         console.log(lisc[l].gameid);
//         try {
//             fetch(`https://api-v2.swissunihockey.ch/api/game_events/${lisc[l].gameid}`)
//                 .then(response => response.json())
//                 .then(data2 => {
//                     let team1_val = [[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],['']]
//                     let team2_val = [[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],['']]

//                     if (data2.data.regions[0].rows.length == 0) {
//                         console.log('no', l);
//                     }
//                     else {
//                         for (let h = 0; h < data2.data.regions[0].rows.length; h++) {
//                             console.log(l, h, lisc[l].gameid, data2.data.regions[0].rows[h].cells[1].text[0]);

//                             if (lisc[l].gameid, data2.data.regions[0].rows[h].cells[1].text[0].includes('Torschütze')) {
//                                 let jk = data2.data.regions[0].rows[h].cells[0].text[0]

//                                 jk = jk.split(':')

//                                 console.log(h, "string.", 'score', data2.data.regions[0].rows[h].cells[0].text[0], data2.data.regions[0].rows[h].cells[2].text[0].replaceAll(' ', ''), 'team1', lisc[l].team1.replaceAll(' ', ''), 'team2', lisc[l].team2.replaceAll(' ', ''));
//                                 if (data2.data.regions[0].rows[h].cells[2].text[0].replaceAll(' ', '') == lisc[l].team1.replaceAll(' ', '') || data2.data.regions[0].rows[h].cells[2].text[0].replaceAll(' ', '').includes(lisc[l].team1.replaceAll(' ', '')) || lisc[l].team1.replaceAll(' ', '').includes(data2.data.regions[0].rows[h].cells[2].text[0].replaceAll(' ', ''))) {
//                                     console.log('t1', parseFloat(jk[0]));
//                                     if (parseFloat(jk[0]) >= 60) {
//                                         console.log('t1>60', parseFloat(jk[0]));
//                                         team1_val[0] = [team1_val[0]+data2.data.regions[0].rows[h].cells[0].text[0]+'/']

//                                     }
//                                     else if (60 > parseFloat(jk[0]) && parseFloat(jk[0]) >= 55) {
//                                         console.log('t1>55', parseFloat(jk[0]));
//                                         team1_val[1] = [team1_val[1]+data2.data.regions[0].rows[h].cells[0].text[0]+'/']

//                                     }

//                                     else if (55 > parseFloat(jk[0]) && parseFloat(jk[0]) >= 50) {
//                                         console.log('t1>50', parseFloat(jk[0]));
//                                         team1_val[2] = [team1_val[2]+data2.data.regions[0].rows[h].cells[0].text[0]+'/']
//                                     }
//                                     else if (50 > parseFloat(jk[0]) && parseFloat(jk[0]) >= 45) {
//                                         console.log('t1>45', parseFloat(jk[0]));
//                                         team1_val[3] = [team1_val[3]+data2.data.regions[0].rows[h].cells[0].text[0]+'/']
//                                     }
//                                     else if (45 > parseFloat(jk[0]) && parseFloat(jk[0]) >= 40) {
//                                         console.log('t1>40', parseFloat(jk[0]));
//                                         team1_val[4] = [team1_val[4]+data2.data.regions[0].rows[h].cells[0].text[0]+'/']
//                                     }
//                                     else if (40 > parseFloat(jk[0]) && parseFloat(jk[0]) >= 35) {
//                                         console.log('t1>35', parseFloat(jk[0]));
//                                         team1_val[5] = [team1_val[5]+data2.data.regions[0].rows[h].cells[0].text[0]+'/']
//                                     }
//                                     else if (35 > parseFloat(jk[0]) && parseFloat(jk[0]) >= 30) {
//                                         console.log('t1>30', parseFloat(jk[0]));
//                                         team1_val[6] = [team1_val[6]+data2.data.regions[0].rows[h].cells[0].text[0]+'/']
//                                     }
//                                     else if (30 > parseFloat(jk[0]) && parseFloat(jk[0]) >= 25) {
//                                         console.log('t1>25', parseFloat(jk[0]));
//                                         team1_val[7] = [team1_val[7]+data2.data.regions[0].rows[h].cells[0].text[0]+'/']
//                                     }
//                                     else if (25 > parseFloat(jk[0]) && parseFloat(jk[0]) >= 20) {
//                                         console.log('t1>20', parseFloat(jk[0]));
//                                         team1_val[8] = [team1_val[8]+data2.data.regions[0].rows[h].cells[0].text[0]+'/']
//                                     }
//                                     else if (20 > parseFloat(jk[0]) && parseFloat(jk[0]) >= 15) {
//                                         console.log('t1>15', parseFloat(jk[0]));
//                                         team1_val[9] = [team1_val[9]+data2.data.regions[0].rows[h].cells[0].text[0]+'/']
//                                     }
//                                     else if (15 > parseFloat(jk[0]) && parseFloat(jk[0]) >= 10) {
//                                         console.log('t1>10', parseFloat(jk[0]));
//                                         team1_val[10] = [team1_val[10]+data2.data.regions[0].rows[h].cells[0].text[0]+'/']
//                                     }
//                                     else if (10 > parseFloat(jk[0]) && parseFloat(jk[0]) >= 5) {
//                                         console.log('t1>5', parseFloat(jk[0]));
//                                         team1_val[11] = [team1_val[11]+data2.data.regions[0].rows[h].cells[0].text[0]+'/']
//                                     }
//                                     else {
//                                         console.log('t1<5', parseFloat(jk[0]));
//                                         team1_val[12] = [team1_val[12]+data2.data.regions[0].rows[h].cells[0].text[0]+'/']
//                                     }





//                                 }
//                                 else if (data2.data.regions[0].rows[h].cells[2].text[0].replaceAll(' ', '') == lisc[l].team2.replaceAll(' ', '') || data2.data.regions[0].rows[h].cells[2].text[0].replaceAll(' ', '').includes(lisc[l].team2.replaceAll(' ', '')) || lisc[l].team2.replaceAll(' ', '').includes(data2.data.regions[0].rows[h].cells[2].text[0].replaceAll(' ', ''))) {
//                                     console.log('t2', parseFloat(jk[0]));
//                                     if (parseFloat(jk[0]) >= 60) {
//                                         console.log('t2>60', parseFloat(jk[0]));
//                                         team2_val[0] = [team2_val[0]+data2.data.regions[0].rows[h].cells[0].text[0]+'/']

//                                     }
//                                     else if (60 > parseFloat(jk[0]) && parseFloat(jk[0]) >= 55) {
//                                         console.log('t2>55', parseFloat(jk[0]));
//                                         team2_val[1] = [team2_val[1]+data2.data.regions[0].rows[h].cells[0].text[0]+'/']
//                                     }

//                                     else if (55 > parseFloat(jk[0]) && parseFloat(jk[0]) >= 50) {
//                                         console.log('t2>50', parseFloat(jk[0]));
//                                         team2_val[2] = [team2_val[2]+data2.data.regions[0].rows[h].cells[0].text[0]+'/']
//                                     }
//                                     else if (50 > parseFloat(jk[0]) && parseFloat(jk[0]) >= 45) {
//                                         console.log('t2>45', parseFloat(jk[0]));
//                                         team2_val[3] = [team2_val[3]+data2.data.regions[0].rows[h].cells[0].text[0]+'/']
//                                     }
//                                     else if (45 > parseFloat(jk[0]) && parseFloat(jk[0]) >= 40) {
//                                         console.log('t2>40', parseFloat(jk[0]));
//                                         team2_val[4] = [team2_val[4]+data2.data.regions[0].rows[h].cells[0].text[0]+'/']
//                                     }
//                                     else if (40 > parseFloat(jk[0]) && parseFloat(jk[0]) >= 35) {
//                                         console.log('t2>35', parseFloat(jk[0]));
//                                         team2_val[5] = [team2_val[5]+data2.data.regions[0].rows[h].cells[0].text[0]+'/']
//                                     }
//                                     else if (35 > parseFloat(jk[0]) && parseFloat(jk[0]) >= 30) {
//                                         console.log('t2>30', parseFloat(jk[0]));
//                                         team2_val[6] = [team2_val[6]+data2.data.regions[0].rows[h].cells[0].text[0]+'/']
//                                     }
//                                     else if (30 > parseFloat(jk[0]) && parseFloat(jk[0]) >= 25) {
//                                         console.log('t2>25', parseFloat(jk[0]));
//                                         team2_val[7] = [team2_val[7]+data2.data.regions[0].rows[h].cells[0].text[0]+'/']
//                                     }
//                                     else if (25 > parseFloat(jk[0]) && parseFloat(jk[0]) >= 20) {
//                                         console.log('t2>20', parseFloat(jk[0]));
//                                         team2_val[8] = [team2_val[8]+data2.data.regions[0].rows[h].cells[0].text[0]+'/']
//                                     }
//                                     else if (20 > parseFloat(jk[0]) && parseFloat(jk[0]) >= 15) {
//                                         console.log('t2>15', parseFloat(jk[0]));
//                                         team2_val[9] = [team2_val[9]+data2.data.regions[0].rows[h].cells[0].text[0]+'/']
//                                     }
//                                     else if (15 > parseFloat(jk[0]) && parseFloat(jk[0]) >= 10) {
//                                         console.log('t2>10', parseFloat(jk[0]));
//                                         team2_val[10] = [team2_val[10]+data2.data.regions[0].rows[h].cells[0].text[0]+'/']
//                                     }
//                                     else if (10 > parseFloat(jk[0]) && parseFloat(jk[0]) >= 5) {
//                                         console.log('t2>5', parseFloat(jk[0]));
//                                         team2_val[11] = [team2_val[11]+data2.data.regions[0].rows[h].cells[0].text[0]+'/']
//                                     }
//                                     else {
//                                         console.log('t2<5', parseFloat(jk[0]));
//                                         team2_val[12] = [team2_val[12]+data2.data.regions[0].rows[h].cells[0].text[0]+'/']
//                                     }



//                                 }

//                             } else {
//                                 console.log(h, "not in the string.");
//                             }

//                         }

//                         console.log(team1_val);
//                         console.log(team2_val);


//                         const sqlIn = `UPDATE 2021_table SET t1_60 = "${team1_val[0][0]}",t1_55 = "${team1_val[1][0]}",t1_50 = "${team1_val[2][0]}",t1_45 = "${team1_val[3][0]}",
//                         t1_40 = "${team1_val[4][0]}",t1_35 = "${team1_val[5][0]}",t1_30 = "${team1_val[6][0]}",t1_25 = "${team1_val[7][0]}",t1_20 = "${team1_val[8][0]}",
//                         t1_15 = "${team1_val[9][0]}",t1_10 = "${team1_val[10][0]}",t1_5 = "${team1_val[11][0]}",t1_0 = "${team1_val[12][0]}" WHERE gameid = ${lisc[l].gameid};`
//                         db.query(sqlIn, (err, result) => {
//                             if (err) {


//                                 console.log('kn',err);
//                             }
//                             else {


//                                 console.log('kn32');

//                             }
//                         })

//                         const sqlIn2 = `UPDATE 2021_table SET t2_60 = "${team2_val[0][0]}",t2_55 = "${team2_val[1][0]}",t2_50 = "${team2_val[2][0]}",t2_45 = "${team2_val[3][0]}",
//                         t2_40 = "${team2_val[4][0]}",t2_35 = "${team2_val[5][0]}",t2_30 = "${team2_val[6][0]}",t2_25 = "${team2_val[7][0]}",t2_20 = "${team2_val[8][0]}",
//                         t2_15 = "${team2_val[9][0]}",t2_10 = "${team2_val[10][0]}",t2_5 = "${team2_val[11][0]}",t2_0 = "${team2_val[12][0]}" WHERE gameid = ${lisc[l].gameid};`
//                         db.query(sqlIn2, (err, result) => {
//                             if (err) {


//                                 console.log('kn');
//                             }
//                             else {


//                                 console.log('kn32');

//                             }
//                         })

//                         team1_val = [[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],['']]
//                         team2_val = [[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],['']]


//                     }

//                 })






//         } catch (error) {

//         }


//         // const sqlIn = `UPDATE 2021_table SET t = ${l},test2 = 'add' WHERE gameid = ${result[l].gameid};`
//         // db.query(sqlIn, [temp], (err, result) => {
//         //     if (err) {


//         //         console.log('kn');
//         //     }
//         //     else {


//         //         console.log('kn32');

//         //     }
//         // })





//         // const sqlIn = `UPDATE 2021_table SET test = ${l},test2 = 'add' WHERE gameid = ${result[l].gameid};`
//         // db.query(sqlIn, [temp], (err, result) => {
//         //     if (err) {


//         //         console.log('kn');
//         //     }
//         //     else {


//         //         console.log('kn32');

//         //     }
//         // })

//     }

//     console.log('END');
// }
// async function setValues(valus) {
//     lisc = valus
//     console.log();
//     lic = []
//     let st = 0
//     for (let rg = 0; rg < 3; rg++) {


//         for (let p = st; p < st+1000; p++) {

//             console.log(p, lisc[p].gameid);
//             try {
//                 let uu3 = `https://api-v2.swissunihockey.ch/api/game_events/${lisc[p].gameid}`
//                 const neb = axios.get(uu3).catch(function (error) {
//                     console.log('error in', p);


//                 });





//                 lic.push(neb)




//             } catch (error) {

//             }
//         }
//         await axios.all(lic).then(
//             axios.spread((...data3) => {
//                 for (let l = 0; l < data3.length; l++) {
//                     try {
//                         let data2 = ''
//                         data2 = data3[l].data
//                         console.log('uk', l, data3[l].data.data.regions[0].rows.length);

//                         let team1_val = [[''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], ['']]
//                         let team2_val = [[''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], ['']]

//                         if (data2.data.regions[0].rows.length == 0) {
//                             console.log('no', l);
//                         }
//                         else {
//                             for (let h = 0; h < data2.data.regions[0].rows.length; h++) {
//                                 console.log(l, h, lisc[st + l].gameid, data2.data.regions[0].rows[h].cells[1].text[0]);

//                                 if (lisc[l].gameid, data2.data.regions[0].rows[h].cells[1].text[0].includes('Torschütze')) {
//                                     let jk = data2.data.regions[0].rows[h].cells[0].text[0]

//                                     jk = jk.split(':')

//                                     console.log(h, "string.", 'score', data2.data.regions[0].rows[h].cells[0].text[0], data2.data.regions[0].rows[h].cells[2].text[0].replaceAll(' ', ''), 'team1', lisc[l].team1.replaceAll(' ', ''), 'team2', lisc[l].team2.replaceAll(' ', ''));
//                                     if (data2.data.regions[0].rows[h].cells[2].text[0].replaceAll(' ', '') == lisc[st + l].team1.replaceAll(' ', '') || data2.data.regions[0].rows[h].cells[2].text[0].replaceAll(' ', '').includes(lisc[st + l].team1.replaceAll(' ', '')) || lisc[st + l].team1.replaceAll(' ', '').includes(data2.data.regions[0].rows[h].cells[2].text[0].replaceAll(' ', ''))) {
//                                         console.log('t1', parseFloat(jk[0]));
//                                         if (parseFloat(jk[0]) >= 60) {
//                                             console.log('t1>60', parseFloat(jk[0]));
//                                             team1_val[0] = [team1_val[0] + data2.data.regions[0].rows[h].cells[0].text[0] + '/']

//                                         }
//                                         else if (60 > parseFloat(jk[0]) && parseFloat(jk[0]) >= 55) {
//                                             console.log('t1>55', parseFloat(jk[0]));
//                                             team1_val[1] = [team1_val[1] + data2.data.regions[0].rows[h].cells[0].text[0] + '/']

//                                         }

//                                         else if (55 > parseFloat(jk[0]) && parseFloat(jk[0]) >= 50) {
//                                             console.log('t1>50', parseFloat(jk[0]));
//                                             team1_val[2] = [team1_val[2] + data2.data.regions[0].rows[h].cells[0].text[0] + '/']
//                                         }
//                                         else if (50 > parseFloat(jk[0]) && parseFloat(jk[0]) >= 45) {
//                                             console.log('t1>45', parseFloat(jk[0]));
//                                             team1_val[3] = [team1_val[3] + data2.data.regions[0].rows[h].cells[0].text[0] + '/']
//                                         }
//                                         else if (45 > parseFloat(jk[0]) && parseFloat(jk[0]) >= 40) {
//                                             console.log('t1>40', parseFloat(jk[0]));
//                                             team1_val[4] = [team1_val[4] + data2.data.regions[0].rows[h].cells[0].text[0] + '/']
//                                         }
//                                         else if (40 > parseFloat(jk[0]) && parseFloat(jk[0]) >= 35) {
//                                             console.log('t1>35', parseFloat(jk[0]));
//                                             team1_val[5] = [team1_val[5] + data2.data.regions[0].rows[h].cells[0].text[0] + '/']
//                                         }
//                                         else if (35 > parseFloat(jk[0]) && parseFloat(jk[0]) >= 30) {
//                                             console.log('t1>30', parseFloat(jk[0]));
//                                             team1_val[6] = [team1_val[6] + data2.data.regions[0].rows[h].cells[0].text[0] + '/']
//                                         }
//                                         else if (30 > parseFloat(jk[0]) && parseFloat(jk[0]) >= 25) {
//                                             console.log('t1>25', parseFloat(jk[0]));
//                                             team1_val[7] = [team1_val[7] + data2.data.regions[0].rows[h].cells[0].text[0] + '/']
//                                         }
//                                         else if (25 > parseFloat(jk[0]) && parseFloat(jk[0]) >= 20) {
//                                             console.log('t1>20', parseFloat(jk[0]));
//                                             team1_val[8] = [team1_val[8] + data2.data.regions[0].rows[h].cells[0].text[0] + '/']
//                                         }
//                                         else if (20 > parseFloat(jk[0]) && parseFloat(jk[0]) >= 15) {
//                                             console.log('t1>15', parseFloat(jk[0]));
//                                             team1_val[9] = [team1_val[9] + data2.data.regions[0].rows[h].cells[0].text[0] + '/']
//                                         }
//                                         else if (15 > parseFloat(jk[0]) && parseFloat(jk[0]) >= 10) {
//                                             console.log('t1>10', parseFloat(jk[0]));
//                                             team1_val[10] = [team1_val[10] + data2.data.regions[0].rows[h].cells[0].text[0] + '/']
//                                         }
//                                         else if (10 > parseFloat(jk[0]) && parseFloat(jk[0]) >= 5) {
//                                             console.log('t1>5', parseFloat(jk[0]));
//                                             team1_val[11] = [team1_val[11] + data2.data.regions[0].rows[h].cells[0].text[0] + '/']
//                                         }
//                                         else {
//                                             console.log('t1<5', parseFloat(jk[0]));
//                                             team1_val[12] = [team1_val[12] + data2.data.regions[0].rows[h].cells[0].text[0] + '/']
//                                         }





//                                     }
//                                     else if (data2.data.regions[0].rows[h].cells[2].text[0].replaceAll(' ', '') == lisc[st + l].team2.replaceAll(' ', '') || data2.data.regions[0].rows[h].cells[2].text[0].replaceAll(' ', '').includes(lisc[st + l].team2.replaceAll(' ', '')) || lisc[st + l].team2.replaceAll(' ', '').includes(data2.data.regions[0].rows[h].cells[2].text[0].replaceAll(' ', ''))) {
//                                         console.log('t2', parseFloat(jk[0]));
//                                         if (parseFloat(jk[0]) >= 60) {
//                                             console.log('t2>60', parseFloat(jk[0]));
//                                             team2_val[0] = [team2_val[0] + data2.data.regions[0].rows[h].cells[0].text[0] + '/']

//                                         }
//                                         else if (60 > parseFloat(jk[0]) && parseFloat(jk[0]) >= 55) {
//                                             console.log('t2>55', parseFloat(jk[0]));
//                                             team2_val[1] = [team2_val[1] + data2.data.regions[0].rows[h].cells[0].text[0] + '/']
//                                         }

//                                         else if (55 > parseFloat(jk[0]) && parseFloat(jk[0]) >= 50) {
//                                             console.log('t2>50', parseFloat(jk[0]));
//                                             team2_val[2] = [team2_val[2] + data2.data.regions[0].rows[h].cells[0].text[0] + '/']
//                                         }
//                                         else if (50 > parseFloat(jk[0]) && parseFloat(jk[0]) >= 45) {
//                                             console.log('t2>45', parseFloat(jk[0]));
//                                             team2_val[3] = [team2_val[3] + data2.data.regions[0].rows[h].cells[0].text[0] + '/']
//                                         }
//                                         else if (45 > parseFloat(jk[0]) && parseFloat(jk[0]) >= 40) {
//                                             console.log('t2>40', parseFloat(jk[0]));
//                                             team2_val[4] = [team2_val[4] + data2.data.regions[0].rows[h].cells[0].text[0] + '/']
//                                         }
//                                         else if (40 > parseFloat(jk[0]) && parseFloat(jk[0]) >= 35) {
//                                             console.log('t2>35', parseFloat(jk[0]));
//                                             team2_val[5] = [team2_val[5] + data2.data.regions[0].rows[h].cells[0].text[0] + '/']
//                                         }
//                                         else if (35 > parseFloat(jk[0]) && parseFloat(jk[0]) >= 30) {
//                                             console.log('t2>30', parseFloat(jk[0]));
//                                             team2_val[6] = [team2_val[6] + data2.data.regions[0].rows[h].cells[0].text[0] + '/']
//                                         }
//                                         else if (30 > parseFloat(jk[0]) && parseFloat(jk[0]) >= 25) {
//                                             console.log('t2>25', parseFloat(jk[0]));
//                                             team2_val[7] = [team2_val[7] + data2.data.regions[0].rows[h].cells[0].text[0] + '/']
//                                         }
//                                         else if (25 > parseFloat(jk[0]) && parseFloat(jk[0]) >= 20) {
//                                             console.log('t2>20', parseFloat(jk[0]));
//                                             team2_val[8] = [team2_val[8] + data2.data.regions[0].rows[h].cells[0].text[0] + '/']
//                                         }
//                                         else if (20 > parseFloat(jk[0]) && parseFloat(jk[0]) >= 15) {
//                                             console.log('t2>15', parseFloat(jk[0]));
//                                             team2_val[9] = [team2_val[9] + data2.data.regions[0].rows[h].cells[0].text[0] + '/']
//                                         }
//                                         else if (15 > parseFloat(jk[0]) && parseFloat(jk[0]) >= 10) {
//                                             console.log('t2>10', parseFloat(jk[0]));
//                                             team2_val[10] = [team2_val[10] + data2.data.regions[0].rows[h].cells[0].text[0] + '/']
//                                         }
//                                         else if (10 > parseFloat(jk[0]) && parseFloat(jk[0]) >= 5) {
//                                             console.log('t2>5', parseFloat(jk[0]));
//                                             team2_val[11] = [team2_val[11] + data2.data.regions[0].rows[h].cells[0].text[0] + '/']
//                                         }
//                                         else {
//                                             console.log('t2<5', parseFloat(jk[0]));
//                                             team2_val[12] = [team2_val[12] + data2.data.regions[0].rows[h].cells[0].text[0] + '/']
//                                         }



//                                     }

//                                 } else {
//                                     console.log(h, "not in the string.");
//                                 }

//                             }

//                             console.log(team1_val);
//                             console.log(team2_val);


//                             const sqlIn = `UPDATE 2021_table SET t1_60 = "${team1_val[0][0]}",t1_55 = "${team1_val[1][0]}",t1_50 = "${team1_val[2][0]}",t1_45 = "${team1_val[3][0]}",
//                                 t1_40 = "${team1_val[4][0]}",t1_35 = "${team1_val[5][0]}",t1_30 = "${team1_val[6][0]}",t1_25 = "${team1_val[7][0]}",t1_20 = "${team1_val[8][0]}",
//                                 t1_15 = "${team1_val[9][0]}",t1_10 = "${team1_val[10][0]}",t1_5 = "${team1_val[11][0]}",t1_0 = "${team1_val[12][0]}" WHERE gameid = ${lisc[st + l].gameid};`
//                             db.query(sqlIn, (err, result) => {
//                                 if (err) {


//                                     console.log('kn', err);
//                                 }
//                                 else {


//                                     console.log('kn32');

//                                 }
//                             })

//                             const sqlIn2 = `UPDATE 2021_table SET t2_60 = "${team2_val[0][0]}",t2_55 = "${team2_val[1][0]}",t2_50 = "${team2_val[2][0]}",t2_45 = "${team2_val[3][0]}",
//                                 t2_40 = "${team2_val[4][0]}",t2_35 = "${team2_val[5][0]}",t2_30 = "${team2_val[6][0]}",t2_25 = "${team2_val[7][0]}",t2_20 = "${team2_val[8][0]}",
//                                 t2_15 = "${team2_val[9][0]}",t2_10 = "${team2_val[10][0]}",t2_5 = "${team2_val[11][0]}",t2_0 = "${team2_val[12][0]}" WHERE gameid = ${lisc[st + l].gameid};`
//                             db.query(sqlIn2, (err, result) => {
//                                 if (err) {


//                                     console.log('kn');
//                                 }
//                                 else {


//                                     console.log('kn32');

//                                 }
//                             })

//                             team1_val = [[''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], ['']]
//                             team2_val = [[''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], ['']]


//                         }



//                     } catch (error) {

//                     }
//                 }





//             })
//         )

//         st = st+1000
//     }


//     // const sqlIn = `UPDATE 2021_table SET t = ${l},test2 = 'add' WHERE gameid = ${result[l].gameid};`
//     // db.query(sqlIn, [temp], (err, result) => {
//     //     if (err) {


//     //         console.log('kn');
//     //     }
//     //     else {


//     //         console.log('kn32');

//     //     }
//     // })





//     // const sqlIn = `UPDATE 2021_table SET test = ${l},test2 = 'add' WHERE gameid = ${result[l].gameid};`
//     // db.query(sqlIn, [temp], (err, result) => {
//     //     if (err) {


//     //         console.log('kn');
//     //     }
//     //     else {


//     //         console.log('kn32');

//     //     }
//     // })



//     console.log('END');
// }







// fetchData3();
// fetchData5();

function fetchData5() {
    let club = []
    const uu1 = 'https://api-v2.swissunihockey.ch/api/clubs?season=2018'
    const uu2 = 'https://api-v2.swissunihockey.ch/api/clubs?season=2019'
    const pik1 = axios.get(uu1)
    const pik2 = axios.get(uu2)
    axios.all([pik1, pik2]).then(
        axios.spread((...allData) => {
            club = allData[0].data.entries
            console.log(club[0].set_in_context.club_id);
            let lic = []
            let jn = false
            for (let i = 0; i < 5; i++) {


                for (let k = 1; k < 20; k++) {
                    let uu3 = `https://api-v2.swissunihockey.ch/api/games?mode=club&season=2018&club_id=${club[i].set_in_context.club_id}&page=${k}`
                    const neb = axios.get(uu3).catch(function (error) {
                        console.log('error in', i, k);
                        jn = false

                    });



                    console.log(jn);

                    lic.push(neb)

                }









            }

            axios.all(lic).then(
                axios.spread((...allData2) => {








                    for (let j = 0; j < allData2.length; j++) {
                        try {
                            datt = allData2.data.regions[0].rows;
                            temp.push(parseInt(datt[j].link.ids[0]));
                            temp.push(datt[j].cells[0].text[0]);
                            temp.push(datt[j].cells[2].text[0]);
                            temp.push(datt[j].cells[3].text[0]);
                            temp.push(datt[j].cells[4].text[0]);
                            temp.push(datt[j].cells[5].text[0]);

                            temp.push('2018')

                            dat_finale.push(temp)

                            const sqlIn = `INSERT INTO 2018_table (gameid,date,league,team1,team2,results,season) VALUES (?)`
                            db.query(sqlIn, [temp], (err, result) => {
                                if (err) {


                                    console.log('kn');
                                }
                                else {


                                    console.log('kn32');

                                }
                            })



                            temp = []

                        } catch (error) {
                            console.log('err',)
                        }

                    }











                })
            )


        })
    )



}

async function fetchData3() {


    const response = await fetch(
        `https://api-v2.swissunihockey.ch/api/clubs?season=2018`

    );
    const data2 = await response.json();
    club = data2.entries
    console.log(club.length);



    for (let i = 0; i < club.length; i++) {

        console.log(i);
        k = 0

        while (1) {
            k++

            console.log('set ', i, 'page ', k);
            try {
                const response2 = await fetch(
                    `https://api-v2.swissunihockey.ch/api/games?mode=club&season=2018&club_id=${club[i].set_in_context.club_id}&page=${k}`

                );
                const data3 = await response2.json();



                if (data3.status == 'An error has occurred.') {
                    break

                }
                else {

                    console.log('end ,', i);

                }
                datt = data3.data.regions[0].rows;
                for (let j = 0; j < datt.length; j++) {
                    temp.push(parseInt(datt[j].link.ids[0]));
                    temp.push(datt[j].cells[0].text[0]);
                    temp.push(datt[j].cells[2].text[0]);
                    temp.push(datt[j].cells[3].text[0]);
                    temp.push(datt[j].cells[4].text[0]);
                    temp.push(datt[j].cells[5].text[0]);

                    temp.push('2018')

                    dat_finale.push(temp)

                    const sqlIn = `INSERT INTO 2022_table (gameid,date,league,team1,team2,results,season) VALUES (?)`
                    db.query(sqlIn, [temp], (err, result) => {
                        if (err) {


                            console.log('kn');
                        }
                        else {


                            console.log('kn32');

                        }
                    })



                    temp = []



                }


            } catch (error) {

            }

        }




    }

    // const sqlIn = `INSERT INTO new_table2 (date,league,team1,team2,results,gameid,season) VALUES (${dat_finale.map(kmn2 => ('(' + "'" + kmn2[0] + "'" + ',' + "'" + kmn2[1] + "'" + ',' + "'" + kmn2[2] + "'" + ',' + "'" + kmn2[3] + "'" + ',' + "'" + kmn2[4] + "'" + ',' + "'" + kmn2[5] + "'" + ',' + "'" + kmn2[6] + "'" + ')'))})`;
    // db.query(sqlIn, (err, result) => {
    //     if (err) {
    //         console.log(err)

    //         console.log('kn');
    //     }
    //     else {
    //         console.log(result);

    //         console.log('kn32');

    //     }
    // })


    // fetch('https://api-v2.swissunihockey.ch/api/teams?league=1&game_class=21')
    //   .then(response => response.json())
    //   .then(data2 => {
    //     console.log('clubs', data2);
    //     console.log('knkn', data2.data.regions[0].rows);
    //     setTeam(data2.data.regions[0].rows)
    //   })

}

function fetchData1() {
    fetch('https://api-v2.swissunihockey.ch/api/seasons')
        .then(response => response.json())
        .then(data2 => {

            datt = data2.entries
            console.log(datt);

        })

}


//data2.entries.map(kmn2 => ())

// ${dat_finale.map(kmn2 => ('(' + "'" + kmn2[0] + "'" + ',' + "'" + kmn2[1] + "'" + ',' + "'" + kmn2[2] + "'" + ',' + "'" + kmn2[3] + "'" + ',' + "'" + kmn2[4] + "'" + ',' + "'" + kmn2[5] + "'" + ',' + "'" + kmn2[6] + "'" + ')'))}

// app.get("/", (req, res) => {

//     const sqlIn = `INSERT INTO new_table2 (date,league,team1,team2,results,gameid,season) VALUES (${dat_finale.map(kmn2 => ('(' + "'" + kmn2[0] + "'" + ',' + "'" + kmn2[1] + "'" + ',' + "'" + kmn2[2] + "'" + ',' + "'" + kmn2[3] + "'" + ',' + "'" + kmn2[4] + "'" + ',' + "'" + kmn2[5] + "'" + ',' + "'" + kmn2[6] + "'" + ')'))})`;

//     try {

//         db.query(sqlIn, (err, result) => {
//             if (err) {
//                 console.log(err)
//                 res.send("hellow world346")
//                 console.log('kn');
//             }
//             else {
//                 console.log(result);
//                 res.send("hellow world345")
//                 console.log('kn32');

//             }

//         })

//     } catch (error) {

//     }









// })




app.listen(PORT, () => {
    console.log('running on port 3001');
})