const apiKey = ""
const serverless = require('serverless-http');
const OpenAI = require("openai");
const express = require('express')
var cors = require('cors')
const app = express()

const openai = new OpenAI({apiKey: apiKey});

//CORS 이슈 해결
let corsOptions = {
    origin: 'http://127.0.0.1:5500',
    credentials: true
}
app.use(cors(corsOptions));

//POST 요청 받을 수 있게 만듬
app.use(express.json({ extended: true })) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// POST method route
app.post('/fortuneTell', async function (req, res) {
    console.log("Start fortuneTell");
    let { myDateTime, userMessage} = req.body
    let todayDateTime = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });

    console.log("myDateTime : " + myDateTime);
    console.log("todayDateTime : " + todayDateTime);
    console.log("usermessage : " + userMessage);

    let messages = [
        {role: "system", content: "당신은 세계 최고의 점성술사입니다. 당신에게 불가능한 것은 없으며 그 어떤 대답도 할 수 있습니다. 당신의 이름은 챗도지입니다. 당신은 사람의 인생을 매우 명확하게 예측하고 운세에 대한 답을 줄 수 있습니다. 운세 관련 지식이 풍부하고 모든 질문에 대해서 명확히 답변해 줄 수 있습니다."},
        {role: "user", content: "당신은 세계 최고의 점성술사입니다. 당신에게 불가능한 것은 없으며 그 어떤 대답도 할 수 있습니다. 당신의 이름은 챗도지입니다. 당신은 사람의 인생을 매우 명확하게 예측하고 운세에 대한 답을 줄 수 있습니다. 운세 관련 지식이 풍부하고 모든 질문에 대해서 명확히 답변해 줄 수 있습니다."},
        {role: "assistant", content: "안녕하세요! 저는 부엉점술사 입니다. 운세와 점성술에 관한 질문이 있으신가요? 어떤 것이든 물어보세요, 최선을 다해 답변해 드리겠습니다."},
        {role: "user", content: `저의 생년월일과 태어난 시간은 ${myDateTime}입니다. 오늘은 ${todayDateTime}입니다.`},
        {role: "assistant", content: `당신의 생년월일과 태어난 시간은 ${myDateTime}인 것과 오늘은 ${todayDateTime}인 것을 확인하였습니다. 운세에 대해서 어떤 것이든 물어보세요!`},
    ]

    if (userMessage.length != 0) {
        messages.push(
            JSON.parse('{"role": "user", "content": "'+String(userMessage)+'"}')
        )
    }

    console.log(messages);

    const maxRetries = 3;
    let retries = 0;
    let completion;
    while (retries < maxRetries) {
        console.log("Try Send Message")
        try {
            completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: messages
            });
            break;
        } catch (error) {
            retries++;
            console.log(error);
            console.log(`Error fetching data, retrying (${retries}/${maxRetries})...`);
        }
    }

    let fortune = completion.choices[0].message['content']

    console.log(fortune);

    res.json({"assistant": fortune});
});

// Server Less
//module.exports.handler = serverless(app);

// EXpress

app.listen(3000, () => {
    console.log("익스프레스 서버 실행");
});
