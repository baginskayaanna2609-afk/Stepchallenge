exports.handler = async function(event) {

  if (event.httpMethod !== 'POST') {

    return { statusCode: 405, body: 'Method Not Allowed' };

  }
 
  try {

    const { image_base64, image_type, steps } = JSON.parse(event.body);
 
    const response = await fetch('https://api.anthropic.com/v1/messages', {

      method: 'POST',

      headers: {

        'Content-Type': 'application/json',

        'x-api-key': process.env.ANTHROPIC_API_KEY,

        'anthropic-version': '2023-06-01'

      },

      body: JSON.stringify({

        model: 'claude-sonnet-4-20250514',

        max_tokens: 300,

        messages: [{

          role: 'user',

          content: [

            {

              type: 'image',

              source: { type: 'base64', media_type: image_type, data: image_base64 }

            },

            {

              type: 'text',

              text: 'Это скриншот приложения для подсчёта шагов. Найди число шагов за сегодня или за день. Ответь ТОЛЬКО JSON без лишнего текста: {"steps_found": число или null, "note": "пояснение на русском"}'

            }

          ]

        }]

      })

    });
 
    const data = await response.json();

    const raw = data.content.map(i => i.text || '').join('');

    const parsed = JSON.parse(raw.replace(/```json|```/g, '').trim());
 
    const aiSteps = parsed.steps_found;

    const note = parsed.note || '';

    let status = 'На проверке';
 
    if (aiSteps !== null) {

      const pct = Math.round(Math.abs(aiSteps - parseInt(steps)) / parseInt(steps) * 100);

      if (pct <= 2) status = 'Подтверждено';

      else if (pct <= 10) status = 'Небольшое расхождение';

      else status = 'Расхождение!';

    }
 
    return {

      statusCode: 200,

      headers: { 'Content-Type': 'application/json' },

      body: JSON.stringify({ ai_steps: aiSteps, note, status })

    };
 
  } catch (err) {

    return {

      statusCode: 200,

      headers: { 'Content-Type': 'application/json' },

      body: JSON.stringify({ ai_steps: null, note: 'Ошибка проверки: ' + err.message, status: 'На проверке' })

    };

  }

};
 
