const { WAConnection: _WAConnection, Browsers, MessageType } = require('@adiwajshing/baileys')

const Client = require('./lib/simple.js')

const WAConnection = Client.WAConnection(_WAConnection)

const  { Functions } = require('./lib/functions.js');

const { color, bgcolor } = require('./lib/color')

const fs = require("fs-extra")



const figlet = require('figlet')

const { uncache, nocache } = require('./lib/loader')

const setting = JSON.parse(fs.readFileSync('./setting.json'))

const welcome = require('./message/group')

baterai = 'unknown'

charging = 'unknown'



//nocache

global.media = require('./src/json/media.json');

global.functions = new Functions();

global.logo = { buffer:functions.fs.readFileSync('./src/images/logo.jpg'),message:media.logo };

require('./iky.js')

nocache('../iky.js', module => console.log(color('[WATCH]', 'yellow'), color(`'${module}'`, 'cyan'), 'File is updated!'))

require('./message/group.js')

nocache('../message/group.js', module => console.log(color('[WATCH]', 'yellow'), color(`'${module}'`, 'yellow'), 'File is updated!'))



const starts = async (ikyy = new WAConnection()) => {

	ikyy.logger.level = 'warn'

	console.log(color(figlet.textSync('بيسم الله', {

		font: 'Standard',

		horizontalLayout: 'default',

		vertivalLayout: 'default',

		width: 80,

		whitespaceBreak: false

	}), 'cyan'))

	console.log(color('[Wann Store]', 'cyan'), color('Owner is online now!', 'yellow'))

	console.log(color('[Wann Store]', 'cyan'), color('Welcome back, Owner! Hope you are doing well~', 'yellow'))

	ikyy.browserDescription = ["WANN - BOTZ", "Chrome", "3.0.0"];



	// Menunggu QR Muncul

	ikyy.on('qr', () => {

		console.log(color('[', 'blue'), color('!', 'red'), color(']', 'white'), color('Please scan qr code'))

	})



	// Menghubungkan Kack

	fs.existsSync(`./${setting.sessionName}.json`) && ikyy.loadAuthInfo(`./${setting.sessionName}.json`)

	ikyy.on('connecting', () => {

		console.log(color('[ WANN STORE ]', 'cyan'), color('Menghubungkan....'));

	})



	//connect

	ikyy.on('open', () => {

		console.log(color('[ WANN STORE ]', 'cyan'), color('Bot Sudah Online!'));

	})



	// session

	await ikyy.connect({

		timeoutMs: 30 * 1000

	})

	fs.writeFileSync(`./${setting.sessionName}.json`, JSON.stringify(ikyy.base64EncodedAuthInfo(), null, '\t'))



	// Baterai

	ikyy.on('CB:action,,battery', json => {

		global.batteryLevelStr = json[2][0][1].value

		global.batterylevel = parseInt(batteryLevelStr)

		baterai = batterylevel

		if (json[2][0][1].live == 'true') charging = true

		if (json[2][0][1].live == 'false') charging = false

		console.log(json[2][0][1])

		console.log('Baterai : ' + batterylevel + '%')

	})

	global.batrei = global.batrei ? global.batrei : []

	ikyy.on('CB:action,,battery', json => {

		const batteryLevelStr = json[2][0][1].value

		const batterylevel = parseInt(batteryLevelStr)

		global.batrei.push(batterylevel)

	})



	// welcome

	ikyy.on('group-participants-update', async (anu) => {

		await welcome(ikyy, anu)

	})

  

  ikyy.on("message-delete", async (m) => {

    if (m.key.remoteJid == "status@broadcast") return;

    if (!m.key.fromMe && m.key.fromMe) return;

    m.message =

      Object.keys(m.message)[0] === "ephemeralMessage"

        ? m.message.ephemeralMessage.message

        : m.message;

    const antidel = JSON.parse(fs.readFileSync("./database/antidelete.json"));

    const isGroup = m.key.remoteJid.endsWith("@g.us")

    const isAntidel = isGroup ? antidel.includes(m.key.remoteJid) : false;

    const moment = require("moment-timezone");

    const jam = moment.tz("Asia/Jakarta").format("HH:mm:ss");

    let d = new Date();

    let locale = "id";

    let gmt = new Date(0).getTime() - new Date("1 Januari 2021").getTime();

    let weton = ["Pahing", "Pon", "Wage", "Kliwon", "Legi"][

      Math.floor((d * 1 + gmt) / 84600000) % 5

    ];

    let week = d.toLocaleDateString(locale, { weekday: "long" });

    let calender = d.toLocaleDateString(locale, {

      day: "numeric",

      month: "long",

      year: "numeric",

    });

    const type = Object.keys(m.message)[0];

    if (!isAntidel) return

    ikyy.sendMessage(

      m.key.remoteJid,

      `\`\`\`「 Anti Delete 」\`\`\`

  •> Nama : @${m.participant.split("@")[0]}

  •> Waktu : ${jam} ${week} ${calender}

  •> Type : ${type}`,

      MessageType.text,

      { quoted: m.message, contextInfo: { mentionedJid: [m.participant] } }

    );



    ikyy.copyNForward(m.key.remoteJid, m.message);

  });

  

	ikyy.on('chat-update', async (message) => {

		require('./iky.js')(ikyy, message)

	})

}



starts()