const Discord = require('discord.js');
const math = require('mathjs');
const bot = new Discord.Client;
const db = require('./db')

bot.login('TOKEN');

//Connection to the server's db
let con = db.dbConnection();

bot.on("message", function (message) {

    //-------------------------------------Setup channel bot------------------------------------------------------//
    if (message.content.startsWith("!parcheminsetup")){
        if (!message.member.roles.cache.has('762065203042713670')){
            return ;
        }

        let channel_id = message.channel.id;
        let sql = "UPDATE" + " server SET channel_id = " + channel_id + " WHERE id = 1";
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("Number of records inserted: " + result.affectedRows);
            message.channel.send("Ce channel est maintenant le channel principal de gestion des parchemins")
        });

        return;
    }
    //----------------------------------------------------------------------------------------------------//



    //----------------------------------- Check parchemin -------------------------------------------------//
    if (message.content.startsWith("!parchemin")){
        let discord_id;

        if (message.mentions.users.size !== 0){
            discord_id = message.mentions.users.first().id;
        }
        else{
            discord_id = message.author.id;
        }

        con.query("SELECT nb_scroll FROM scroll WHERE discord_id = ?", [discord_id], function (err, result) {
            if (err) throw err;

            //If the user is already registered
            if (result.length > 0) {
                message.channel.send("<@" + discord_id + "> possède **" + result[0].nb_scroll + " 📜** dans ses poches !");
            }
        });
    }
    //----------------------------------------------------------------------------------------------------//



    //----------------------------------------Check Xp--------------------------------------------------------//
    if (message.content.startsWith("!xpparchemin")){
        let discord_id;

        if (message.mentions.users.size !== 0){
            discord_id = message.mentions.users.first().id;
        }
        else{
            discord_id = message.author.id;
        }

        con.query("SELECT xp FROM scroll WHERE discord_id = ?", [discord_id], function (err, result) {
            if (err) throw err;

            //If the user is already registered
            if (result.length > 0) {
                message.channel.send("<@" + discord_id + "> possède **" + result[0].xp + "/50 points d'xp** avant son prochain parchemin !");
            }
        });
    }
    //----------------------------------------------------------------------------------------------------//


    //--------------------------------------Setup channel (xp)-----------------------------------------------------//
    if (message.content.startsWith("!setupchannel")){
        if (!message.member.roles.cache.has('762065203042713670')){
            return ;
        }

        let channel_id = message.channel.id;

        con.query("SELECT channel_id FROM channel WHERE channel_id = ?", [channel_id], function (err, result) {
            if (err) throw err;

            if (result.length > 0) {
                message.channel.send("L'xp est déjà activé dans ce channel");
            }
            else{
                let sql = "INSERT INTO " + " channel (channel_id) VALUES ('" + channel_id + "')";
                con.query(sql, function (err, result) {
                    if (err) throw err;
                    console.log("Number of records inserted: " + result.affectedRows);
                    message.channel.send("L'xp a bien était activée !");
                });
            }
        });
    }
    //----------------------------------------------------------------------------------------------------//



    //--------------------------------------Remove Setup channel (xp)-----------------------------------------------------//
    if (message.content.startsWith("!removesetupchannel")){
        if (!message.member.roles.cache.has('762065203042713670')){
            return ;
        }
        let channel_id = message.channel.id;

        con.query("DELETE FROM channel WHERE channel_id = ?", [channel_id], function (err, result) {
            if (err) throw err;
            console.log("Number of records inserted: " + result.affectedRows);
            message.channel.send("L'xp est maintenant désactivée dans ce channel");
        });
    }
    //----------------------------------------------------------------------------------------------------//



    //-----------------------------------------Add parchemin------------------------------------------------------//
    if (message.content.startsWith("!addparchemin")){
        if (!message.member.roles.cache.has('762065203042713670')){
            return ;
        }
        let discord_id;
        let nb_scroll;
        let args = message.content.split(' ');
        args.shift();
        console.log(args);

        if (message.mentions.users.size !== 0){
            discord_id = message.mentions.users.first().id;
        }

        con.query("SELECT nb_scroll FROM scroll WHERE discord_id = ?", [discord_id], function (err, result) {
            if (err) throw err;

            //If the user is already registered
            if (result.length > 0 && args.length === 2) {
                nb_scroll = result[0].nb_scroll;
                nb_scroll += parseInt(args[1]);

                let sql2 = "UPDATE" + " scroll SET nb_scroll = " + nb_scroll + " WHERE discord_id = " + discord_id + "";
                con.query(sql2, function (err, result) {
                    if (err) throw err;
                    console.log("Number of records inserted: " + result.affectedRows);
                });

                message.channel.send("<@" + discord_id + "> possède maintenant **" + nb_scroll + " 📜** dans ses poches !");
            }
        });
    }
    //-------------------------------------------------------------------------------------------------//



    //-----------------------------------------Remove parchemin--------------------------------------------------//
    if (message.content.startsWith("!removeparchemin")){
        if (!message.member.roles.cache.has('762065203042713670')){
            return ;
        }
        let discord_id;
        let nb_scroll;
        let args = message.content.split(' ');
        args.shift();
        console.log(args);

        if (message.mentions.users.size !== 0){
            discord_id = message.mentions.users.first().id;
        }

        con.query("SELECT nb_scroll FROM scroll WHERE discord_id = ?", [discord_id], function (err, result) {
            if (err) throw err;

            //If the user is already registered
            if (result.length > 0 && args.length === 2) {
                nb_scroll = result[0].nb_scroll;
                nb_scroll -= parseInt(args[1]);

                let sql2 = "UPDATE" + " scroll SET nb_scroll = " + nb_scroll + " WHERE discord_id = " + discord_id + "";
                con.query(sql2, function (err, result) {
                    if (err) throw err;
                    console.log("Number of records inserted: " + result.affectedRows);
                });

                message.channel.send("<@" + discord_id + "> possède maintenant **" + nb_scroll + " 📜** dans ses poches !");
            }
        });
    }
    //-------------------------------------------------------------------------------------------------//



    //----------------------------------------Check Soul--------------------------------------------------------//
    if (message.content.startsWith("!soul")){
        let discord_id;

        if (message.mentions.users.size !== 0){
            discord_id = message.mentions.users.first().id;
        }
        else{
            discord_id = message.author.id;
        }

        con.query("SELECT nb_soul FROM scroll WHERE discord_id = ?", [discord_id], function (err, result) {
            if (err) throw err;

            //If the user is already registered
            if (result.length > 0) {
                message.channel.send("<@" + discord_id + "> possède **" + result[0].nb_soul + " 👻 !**");
            }
        });
    }
//----------------------------------------------------------------------------------------------------//


//-----------------------------------------Add Soul------------------------------------------------------//
    if (message.content.startsWith("!addsoul")){
        if (!message.member.roles.cache.has('762065203042713670')){
            return ;
        }
        let discord_id;
        let nb_soul;
        let args = message.content.split(' ');
        args.shift();
        console.log(args);

        if (message.mentions.users.size !== 0){
            discord_id = message.mentions.users.first().id;
        }

        con.query("SELECT nb_soul FROM scroll WHERE discord_id = ?", [discord_id], function (err, result) {
            if (err) throw err;

            //If the user is already registered
            if (result.length > 0 && args.length === 2) {
                nb_soul = result[0].nb_soul;
                nb_soul += parseInt(args[1]);

                let sql2 = "UPDATE" + " scroll SET nb_soul = " + nb_soul + " WHERE discord_id = " + discord_id + "";
                con.query(sql2, function (err, result) {
                    if (err) throw err;
                    console.log("Number of records inserted: " + result.affectedRows);
                });

                message.channel.send("<@" + discord_id + "> possède maintenant **" + nb_soul + " 👻 !**");
            }
        });
    }
//-------------------------------------------------------------------------------------------------//


//-----------------------------------------Remove Soul--------------------------------------------------//
    if (message.content.startsWith("!removesoul")){
        if (!message.member.roles.cache.has('762065203042713670')){
            return ;
        }
        let discord_id;
        let nb_soul;
        let args = message.content.split(' ');
        args.shift();
        console.log(args);

        if (message.mentions.users.size !== 0){
            discord_id = message.mentions.users.first().id;
        }

        con.query("SELECT nb_soul FROM scroll WHERE discord_id = ?", [discord_id], function (err, result) {
            if (err) throw err;

            //If the user is already registered
            if (result.length > 0 && args.length === 2) {
                nb_soul = result[0].nb_soul;
                nb_soul -= parseInt(args[1]);

                let sql2 = "UPDATE" + " scroll SET nb_soul = " + nb_soul + " WHERE discord_id = " + discord_id + "";
                con.query(sql2, function (err, result) {
                    if (err) throw err;
                    console.log("Number of records inserted: " + result.affectedRows);
                });

                message.channel.send("<@" + discord_id + "> possède maintenant **" + nb_soul + " 👻 !**");
            }
        });
    }
//-------------------------------------------------------------------------------------------------//



    //----------------------------------------Check Gem--------------------------------------------------------//
    if (message.content.startsWith("!gem")){
        let discord_id;

        if (message.mentions.users.size !== 0){
            discord_id = message.mentions.users.first().id;
        }
        else{
            discord_id = message.author.id;
        }

        con.query("SELECT nb_gem FROM scroll WHERE discord_id = ?", [discord_id], function (err, result) {
            if (err) throw err;

            //If the user is already registered
            if (result.length > 0) {
                message.channel.send("<@" + discord_id + "> possède **" + result[0].nb_gem + " 💎 !**");
            }
        });
    }
//----------------------------------------------------------------------------------------------------//


//-----------------------------------------Add Gem------------------------------------------------------//
    if (message.content.startsWith("!addgem")){
        if (!message.member.roles.cache.has('762065203042713670')){
            return ;
        }
        let discord_id;
        let nb_gem;
        let args = message.content.split(' ');
        args.shift();
        console.log(args);

        if (message.mentions.users.size !== 0){
            discord_id = message.mentions.users.first().id;
        }

        con.query("SELECT nb_gem FROM scroll WHERE discord_id = ?", [discord_id], function (err, result) {
            if (err) throw err;

            //If the user is already registered
            if (result.length > 0 && args.length === 2) {
                nb_gem = result[0].nb_gem;
                nb_gem += parseInt(args[1]);

                let sql2 = "UPDATE" + " scroll SET nb_gem = " + nb_gem + " WHERE discord_id = " + discord_id + "";
                con.query(sql2, function (err, result) {
                    if (err) throw err;
                    console.log("Number of records inserted: " + result.affectedRows);
                });

                message.channel.send("<@" + discord_id + "> possède maintenant **" + nb_gem + " 💎 !**");
            }
        });
    }
//-------------------------------------------------------------------------------------------------//


//-----------------------------------------Remove Gem--------------------------------------------------//
    if (message.content.startsWith("!removegem")){
        if (!message.member.roles.cache.has('762065203042713670')){
            return ;
        }
        let discord_id;
        let nb_gem;
        let args = message.content.split(' ');
        args.shift();
        console.log(args);

        if (message.mentions.users.size !== 0){
            discord_id = message.mentions.users.first().id;
        }

        con.query("SELECT nb_gem FROM scroll WHERE discord_id = ?", [discord_id], function (err, result) {
            if (err) throw err;

            //If the user is already registered
            if (result.length > 0 && args.length === 2) {
                nb_gem = result[0].nb_gem;
                nb_gem -= parseInt(args[1]);

                let sql2 = "UPDATE" + " scroll SET nb_gem = " + nb_gem + " WHERE discord_id = " + discord_id + "";
                con.query(sql2, function (err, result) {
                    if (err) throw err;
                    console.log("Number of records inserted: " + result.affectedRows);
                });

                message.channel.send("<@" + discord_id + "> possède maintenant **" + nb_gem + " 💎 !**");
            }
        });
    }
//-------------------------------------------------------------------------------------------------//



    //----------------------------------------Check Ps--------------------------------------------------------//
    if (message.content.startsWith("!ps")){
        let discord_id;

        if (message.mentions.users.size !== 0){
            discord_id = message.mentions.users.first().id;
        }
        else{
            discord_id = message.author.id;
        }

        con.query("SELECT nb_ps FROM scroll WHERE discord_id = ?", [discord_id], function (err, result) {
            if (err) throw err;

            //If the user is already registered
            if (result.length > 0) {
                message.channel.send("<@" + discord_id + "> possède **" + result[0].nb_ps + " 🩸 !**");
            }
        });
    }
//----------------------------------------------------------------------------------------------------//


//-----------------------------------------Add Ps------------------------------------------------------//
    if (message.content.startsWith("!addps")){
        if (!message.member.roles.cache.has('762065203042713670')){
            return ;
        }
        let discord_id;
        let nb_ps;
        let args = message.content.split(' ');
        args.shift();
        console.log(args);

        if (message.mentions.users.size !== 0){
            discord_id = message.mentions.users.first().id;
        }

        con.query("SELECT nb_ps FROM scroll WHERE discord_id = ?", [discord_id], function (err, result) {
            if (err) throw err;

            //If the user is already registered
            if (result.length > 0 && args.length === 2) {
                nb_ps = result[0].nb_ps;
                nb_ps += parseInt(args[1]);

                let sql2 = "UPDATE" + " scroll SET nb_ps = " + nb_ps + " WHERE discord_id = " + discord_id + "";
                con.query(sql2, function (err, result) {
                    if (err) throw err;
                    console.log("Number of records inserted: " + result.affectedRows);
                });

                message.channel.send("<@" + discord_id + "> possède maintenant **" + nb_ps + " 🩸 !**");
            }
        });
    }
//-------------------------------------------------------------------------------------------------//


//-----------------------------------------Remove Ps--------------------------------------------------//
    if (message.content.startsWith("!removeps")){
        if (!message.member.roles.cache.has('762065203042713670')){
            return ;
        }
        let discord_id;
        let nb_ps;
        let args = message.content.split(' ');
        args.shift();
        console.log(args);

        if (message.mentions.users.size !== 0){
            discord_id = message.mentions.users.first().id;
        }

        con.query("SELECT nb_ps FROM scroll WHERE discord_id = ?", [discord_id], function (err, result) {
            if (err) throw err;

            //If the user is already registered
            if (result.length > 0 && args.length === 2) {
                nb_ps = result[0].nb_ps;
                nb_ps -= parseInt(args[1]);

                let sql2 = "UPDATE" + " scroll SET nb_ps = " + nb_ps + " WHERE discord_id = " + discord_id + "";
                con.query(sql2, function (err, result) {
                    if (err) throw err;
                    console.log("Number of records inserted: " + result.affectedRows);
                });

                message.channel.send("<@" + discord_id + "> possède maintenant **" + nb_ps + " 🩸 !**");
            }
        });
    }
//-------------------------------------------------------------------------------------------------//



    //----------------------------------------Check Transmopoint--------------------------------------------------------//
    if (message.content.startsWith("!transmopoint")){
        let discord_id;

        if (message.mentions.users.size !== 0){
            discord_id = message.mentions.users.first().id;
        }
        else{
            discord_id = message.author.id;
        }

        con.query("SELECT nb_transmopoint FROM scroll WHERE discord_id = ?", [discord_id], function (err, result) {
            if (err) throw err;

            //If the user is already registered
            if (result.length > 0) {
                message.channel.send("<@" + discord_id + "> possède **" + result[0].nb_transmopoint + " 🧛 !**");
            }
        });
    }
//----------------------------------------------------------------------------------------------------//


//-----------------------------------------Add Transmopoint------------------------------------------------------//
    if (message.content.startsWith("!addtransmopoint")){
        if (!message.member.roles.cache.has('762065203042713670')){
            return ;
        }
        let discord_id;
        let nb_transmopoint;
        let args = message.content.split(' ');
        args.shift();
        console.log(args);

        if (message.mentions.users.size !== 0){
            discord_id = message.mentions.users.first().id;
        }

        con.query("SELECT nb_transmopoint FROM scroll WHERE discord_id = ?", [discord_id], function (err, result) {
            if (err) throw err;

            //If the user is already registered
            if (result.length > 0 && args.length === 2) {
                nb_transmopoint = result[0].nb_transmopoint;
                nb_transmopoint += parseInt(args[1]);

                let sql2 = "UPDATE" + " scroll SET nb_transmopoint = " + nb_transmopoint + " WHERE discord_id = " + discord_id + "";
                con.query(sql2, function (err, result) {
                    if (err) throw err;
                    console.log("Number of records inserted: " + result.affectedRows);
                });

                message.channel.send("<@" + discord_id + "> possède maintenant **" + nb_transmopoint + " 🧛 !**");
            }
        });
    }
//-------------------------------------------------------------------------------------------------//


//-----------------------------------------Remove Transmopoint--------------------------------------------------//
    if (message.content.startsWith("!removetransmopoint")){
        if (!message.member.roles.cache.has('762065203042713670')){
            return ;
        }
        let discord_id;
        let nb_transmopoint;
        let args = message.content.split(' ');
        args.shift();
        console.log(args);

        if (message.mentions.users.size !== 0){
            discord_id = message.mentions.users.first().id;
        }

        con.query("SELECT nb_transmopoint FROM scroll WHERE discord_id = ?", [discord_id], function (err, result) {
            if (err) throw err;

            //If the user is already registered
            if (result.length > 0 && args.length === 2) {
                nb_transmopoint = result[0].nb_transmopoint;
                nb_transmopoint -= parseInt(args[1]);

                let sql2 = "UPDATE" + " scroll SET nb_transmopoint = " + nb_transmopoint + " WHERE discord_id = " + discord_id + "";
                con.query(sql2, function (err, result) {
                    if (err) throw err;
                    console.log("Number of records inserted: " + result.affectedRows);
                });

                message.channel.send("<@" + discord_id + "> possède maintenant **" + nb_transmopoint + " 🧛 !**");
            }
        });
    }
//-------------------------------------------------------------------------------------------------//



    //----------------------------------------Check All--------------------------------------------------------//
    if (message.content.startsWith("!all")){
        let discord_id;
        let parchemin;
        let soul;
        let gem;
        let ps;
        let xp_parchemin;
        let transmopoint;

        if (message.mentions.users.size !== 0){
            discord_id = message.mentions.users.first().id;
        }
        else{
            discord_id = message.author.id;
        }

        con.query("SELECT nb_scroll FROM scroll WHERE discord_id = ?", [discord_id], function (err, result) {
            if (err) throw err;

            //If the user is already registered
            if (result.length > 0) {
                parchemin = result[0].nb_scroll;
            }

            con.query("SELECT nb_soul FROM scroll WHERE discord_id = ?", [discord_id], function (err, result) {
                if (err) throw err;

                //If the user is already registered
                if (result.length > 0) {
                    soul = result[0].nb_soul;
                }

                con.query("SELECT nb_gem FROM scroll WHERE discord_id = ?", [discord_id], function (err, result) {
                    if (err) throw err;

                    //If the user is already registered
                    if (result.length > 0) {
                        gem = result[0].nb_gem;
                    }

                    con.query("SELECT nb_ps FROM scroll WHERE discord_id = ?", [discord_id], function (err, result) {
                        if (err) throw err;

                        //If the user is already registered
                        if (result.length > 0) {
                            ps = result[0].nb_ps;
                        }

                        con.query("SELECT xp FROM scroll WHERE discord_id = ?", [discord_id], function (err, result) {
                            if (err) throw err;

                            //If the user is already registered
                            if (result.length > 0) {
                                xp_parchemin = result[0].xp
                            }

                            con.query("SELECT nb_transmopoint FROM scroll WHERE discord_id = ?", [discord_id], function (err, result) {
                                if (err) throw err;

                                //If the user is already registered
                                if (result.length > 0) {
                                    transmopoint = result[0].nb_transmopoint
                                }

                                // inside a command, event listener, etc.
                                const exampleEmbed = new Discord.MessageEmbed()
                                    .setColor('#33C1FF')
                                    .setTitle("__Possessions__")
                                    .setDescription('*Parchemin :*   ' + parchemin + ' 📜\n' + "__Xp parchemin : " + xp_parchemin + "/50__\n\n" + "*Ames :*   " + soul + " 👻\n\n" + "*Gemmes obscures :*   " + gem + " 💎\n\n" + "*Part sombre :*   " + ps + " 🩸\n\n" + "*Transmopoint :*   " + transmopoint + " 🧛")

                                message.channel.send(exampleEmbed);
                            });
                        });
                    });
                });
            });
        });
    }
//----------------------------------------------------------------------------------------------------//


    //-----------------------------------------Random--------------------------------------------------//
    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max) + 1);
    }
    //-------------------------------------------------------------------------------------------//


    //-----------------------------------------Dice--------------------------------------------------//
    if (message.content.startsWith("!r ")){
        let args = message.content.split(' ');
        args.shift();
        let str = args[0];
        let cpt = 0;
        let answer = "";
        let finalAnswer = "";
        let value = 0;

        const calc = str.split("+")
        let chars;


        //let nb_dice = chars[0];
        //let size_dice = chars[1];
        let nb_dice;
        let size_dice;

        for (let i = 0; i < calc.length; i++) {
            chars = calc[i].split('d');
            if (chars.length < 2){
                message.reply("Enculé tapes la bonne commande !");
                return;
            }
            nb_dice = chars[0]
            size_dice = chars[1];
            if(nb_dice === "") nb_dice = 1;
            if (size_dice === "")  size_dice = 1;
            console.log(nb_dice + " " + size_dice);

            answer += "(";
            for (let i = 1; i <= nb_dice; i++) {
                value = getRandomInt(size_dice);
                answer += value + " + ";
                cpt += value;
            }
            answer = answer.substring(0, answer.length - 3);
            answer += ") + ";
        }

        if (calc.length > 1 || nb_dice > 1){
            finalAnswer = answer.substring(0, answer.length - 3);
            finalAnswer += " = " + cpt;
        }
        else finalAnswer = answer.substring(1, answer.length - 4);

        if (finalAnswer.length > 1024 && finalAnswer.length < 1940){
            message.channel.send("Ca faisait beaucoup donc je te le mets en dur\nRésultat = " + finalAnswer);
        }
        else if (finalAnswer.length > 2000) {
            message.channel.send("Ca faisait beaucoup donc je te le mets en dur\nRésultat = " + cpt);
        }
        else {
            const embed = new Discord.MessageEmbed()
                .setColor(0xfffff)
                .setTitle('Lancer de dé')
                .addField('Lancé', `\`\`\`js\n${args[0]}\`\`\``)
                .addField('Résultat', `\`\`\`js\n${finalAnswer}\`\`\``)

            message.channel.send(embed);
        }



    }
//-------------------------------------------------------------------------------------------------//



    //-----------------------------------------Calculatrice--------------------------------------------------//
    if (message.content.startsWith("!c")){
        let args = message.content.split(' ');
        args.shift();

        if (!args[0]) return message.channel.send("Erreur dans l'écriture du calcul !");

        let resp;
        try {
            resp = math.evaluate(args[0]);
        }catch (e){
            console.log(resp);
            return message.channel.send("Erreur dans l'écriture du calcul");
        }

        const embed = new Discord.MessageEmbed()
            .setColor(0xfffff)
            .setTitle('Calculatrice')
            .addField('Calcul', `\`\`\`js\n${args[0]}\`\`\``)
            .addField('Résultat', `\`\`\`js\n${resp}\`\`\``)

        message.channel.send(embed);
    }
    //-------------------------------------------------------------------------------------------------//



    //-----------------------------------------Bon--------------------------------------------------//
    if (message.content.startsWith("!bon")){
        if (!message.member.roles.cache.has('762065203042713670')){
            return ;
        }
        let discord_id;
        let args = message.content.split(' ');
        args.shift();

        if (message.mentions.users.size !== 0){
            discord_id = message.mentions.users.first().id;
        }

        message.channel.send("<@" + discord_id + "> sera ban dans 5 secondes, pour annuler le ban tapez !cancel");
        let cpt = 5;
        let time = 0;
        for (let i=0; i<5; i++) {
            task(i);
            console.log(cpt);

        }

        function task(i) {
            setTimeout(function() {
                time = i + cpt;
                message.channel.send(time);
                cpt -= 2;
                if (cpt === -5){
                    message.channel.send("Nan j'dec");
                }
            }, 2000 * i);
        }
    }
//-------------------------------------------------------------------------------------------------//


    //-------------------------------------------Points---------------------------------------------------//
    if (message.content.startsWith("") && message.author.id !== "768737101230374932"){
        //Keeping the author's id and his username
        let discord_id = message.author.id;
        let username = message.author.username;
        let size = message.content.length;
        let channel_id = message.channel.id;

        con.query("SELECT channel_id FROM channel WHERE channel_id = ?", [channel_id], function (err, result) {
            if (result.length > 0){
                console.log("Good channel");
                //Verifying if the user's discord_id already exist in db
                con.query("SELECT discord_id, xp, nb_scroll FROM scroll WHERE discord_id = ?", [discord_id], function (err, result) {
                    //If user already exist - Adding scroll
                    if (result.length > 0) {
                        console.log("Good user");
                        let points = result[0].xp;
                        let scroll = result[0].nb_scroll;
                        if (size > 200 && size < 500){points += 1;}
                        else if (size > 500 && size < 1200){points += 2}
                        else if (size > 1200 && size < 2000){points += 3}
                        else{}

                        if (points > 50){
                            console.log("Lvl up");
                            points = points - 50;
                            scroll += 1;

                            let sql2 = "UPDATE" + " scroll SET nb_scroll = " + scroll + " WHERE discord_id = " + discord_id + "";
                            con.query(sql2, function (err, result) {
                                if (err) throw err;
                                console.log("Number of records inserted: " + result.affectedRows);
                            });

                            con.query("SELECT channel_id FROM server WHERE id = 1", function (err, result) {
                                let channel_id = result[0].channel_id;
                                console.log(channel_id);
                                bot.channels.cache.find(test => test.id === channel_id).send("Bien joué <@" + discord_id + "> ! Tu viens de gagner un parchemin !");
                            });

                        }

                        let sql = "UPDATE" + " scroll SET xp = " + points + " WHERE discord_id = " + discord_id + "";
                        con.query(sql, function (err, result) {
                            if (err) throw err;
                            console.log("Number of records inserted: " + result.affectedRows);
                        });

                    }

                    //If user not exist - Adding him to db
                    else{
                        let sql = "INSERT INTO " + " scroll (discord_id, username) VALUES ('" + discord_id + "','" + username + "')";
                        con.query(sql, function (err, result) {
                            if (err) throw err;
                            console.log("Number of records inserted: " + result.affectedRows);
                        });
                    }

                });
            }
        });
    }
});
//----------------------------------------------------------------------------------------------------//









