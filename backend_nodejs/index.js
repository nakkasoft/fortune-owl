const apiKey = "sk-"
const serverless = require('serverless-http');
const OpenAI = require("openai");
const express = require('express')
var cors = require('cors')
const app = express()

const openai = new OpenAI({apiKey: apiKey});

//CORS 이슈 해결
let corsOptions = {
    origin: 'https://fortune-owl.pages.dev',
    credentials: true
}
app.use(cors(corsOptions));

//POST 요청 받을 수 있게 만듬
app.use(express.json({ extended: true })) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// POST method route
app.post('/fortuneTell', async function (req, res) {
    console.log("Start fortuneTell");
    let { myDateTime, requestType} = req.body
    let todayDateTime = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });

    console.log("myDateTime : " + myDateTime);
    console.log("todayDateTime : " + todayDateTime);
    console.log("requestType : " + requestType);

    let messages = [
        {role: "system", content: "당신은 세계 최고의 점성술사입니다. 당신에게 불가능한 것은 없으며 그 어떤 대답도 할 수 있습니다. 당신의 이름은 챗도지입니다. 당신은 사람의 인생을 매우 명확하게 예측하고 운세에 대한 답을 줄 수 있습니다. 운세 관련 지식이 풍부하고 모든 질문에 대해서 명확히 답변해 줄 수 있습니다."},
        {role: "user", content: "당신은 세계 최고의 점성술사입니다. 당신에게 불가능한 것은 없으며 그 어떤 대답도 할 수 있습니다. 당신의 이름은 챗도지입니다. 당신은 사람의 인생을 매우 명확하게 예측하고 운세에 대한 답을 줄 수 있습니다. 운세 관련 지식이 풍부하고 모든 질문에 대해서 명확히 답변해 줄 수 있습니다."},
        {role: "assistant", content: "안녕하세요! 저는 부엉점술사 입니다. 운세와 점성술에 관한 질문이 있으신가요? 어떤 것이든 물어보세요, 최선을 다해 답변해 드리겠습니다."},
        {role: "user", content: `저의 생년월일과 태어난 시간은 ${myDateTime}입니다. 오늘은 ${todayDateTime}입니다.`},
        {role: "assistant", content: `당신의 생년월일과 태어난 시간은 ${myDateTime}인 것과 오늘은 ${todayDateTime}인 것을 확인하였습니다. 운세에 대해서 어떤 것이든 물어보세요!`},
    ]

    let addingMesageToday = "오늘의 운세와 연애운, 재물운에 대해서 알려 주세요. 양식은 제 생일은 다시 말씀 해주실 필요 없으며, 오늘 날짜 부터 자세히 이야기 해주세요. div에 바로 삽입 가능한 형태로 주세요."
    let addingMesageTmr = "내일의 운세와 연애운, 재물운에 대해서 알려 주세요. 양식은 제 생일은 다시 말씀 해주실 필요 없으며, 내일 날짜 부터 자세히 이야기 해주세요. div에 바로 삽입 가능한 형태로 주세요."

    if (requestType == "tomorrow") {
        messages.push(
            JSON.parse('{"role": "user", "content": "'+String(addingMesageToday)+'"}')
        )
    }else{
        messages.push(
            JSON.parse('{"role": "user", "content": "'+String(addingMesageTmr)+'"}')
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


// POST method route
app.post('/fortuneTelldev', async function (req, res) {
    console.log("Start fortuneTelldev");

    let dummyData = "2024년 8월21일 오늘의 운세를 알려드리겠습니다. 오늘은 당신에게 새로운 시작을 가져다줄 수 있는 특별한 날입니다. \
    우주의 에너지가 당신을 지지하고 있어 모든 일들이 순조롭게 진행될 것입니다. \
    오늘은 과감한 결정을 내리기에 좋은 날이며, 어떤 일을 시작하든 성공을 거둘 수 있을 것입니다. \
    자신의 목표와 꿈을 다시 한 번 떠올리고 당신의 열정과 의지를 다시 한 번 되새길 필요가 있습니다. \
    감정적으로는 조금 예민할 수 있으니 다른 사람들과의 대화에 신중함을 가질 필요가 있습니다. \
    이해관계에 있던 어려움을 해결하고자 노력하면 긍정적인 결과를 얻을 수 있을 것입니다. \
    주변 사람들과 소통하며 서로의 마음을 이해하는 데 시간을 할애하는 것이 중요합니다. \
    건강적으로는 지나친 스트레스와 긴장에 주의해야 합니다. \
    충분한 휴식과 식사, 운동을 통해 자신의 몸을 챙기는 것이 중요합니다. \
    마음의 평안과 몸의 건강은 당신이 모든 일을 성취하는데 필수적인 조건입니다. \
    오늘의 운세는 변화와 성공을 가져다 줄 것입니다. \
    자신을 믿고 도전에 임하며, 극복할 수 있는 모든 고난을 만났을 때 스텝을 오르며 행운이 우러나올 것입니다. \
    오늘 하루도 활기차게 시작하여 좋은 일들이 당신을 기다리고 있습니다."

    res.json({"assistant": dummyData});
});

// Server Less
//module.exports.handler = serverless(app);

// EXpress

app.listen(3000, () => {
    console.log("익스프레스 서버 실행");
});
