const {OpenAI} = require('openai')
require('dotenv').config()
const express = require('express')
const app = express()
const port = 4000
const bodyParser = require('body-parser')
bodyParser.json();
app.use(express.json());

const cors = require('cors')
const corsOption = {
    origin: ['http://localhost:3000'],
    credentials: true,
}
app.use(cors(corsOption));

const getAIResponse=(req, res) => {
    const {userPrompt}=req.body
    
    try {
          const openai = new OpenAI({
              apiKey: process.env.OPENAI_API_KEY
            });

        ;(async()=> {
            const response = await openai.chat.completions.create({
              messages: [{role: 'user', content:userPrompt }],
              model: 'gpt-3.5-turbo',
              max_tokens:10,
            });
            res.status(200).json({
                success:true,
                data:response.choices[0].message
            })
          })()
        
      } catch (error) {
        console.log(error)
        res.status(500).json({
            success:false,
            message:error.message
        })
      }
  }


app.get('/', (req, res) => {
    res.send('Hello Backend!')
  })

app.post('/getResponse',getAIResponse)
// app.post('/getResponse',(req,res)=>(res.status(200).json({success:true,data:"This hello from api"})))

  app.listen(port, () => {
    console.log(`server is started`)
  })




