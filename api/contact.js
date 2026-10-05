const MAILTRAP_API='https://send.api.mailtrap.io/api/send';

function esc(v=''){
  return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
}
function validEmail(v){
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}
function layout(inner){
  return `<!doctype html><html><body style="margin:0;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif;color:#171717"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:30px 12px"><tr><td align="center"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;background:#ffffff;border:1px solid #e8e2dc;border-radius:14px;overflow:hidden"><tr><td style="padding:28px 34px 18px"><img src="https://bridgewords.sg/BW_Logo_Colour.png" alt="BridgeWords Consulting Pte Ltd" style="max-width:210px;height:auto"></td></tr><tr><td style="padding:8px 34px 34px">${inner}</td></tr><tr><td style="padding:22px 34px;border-top:1px solid #eee8e1;font-size:12px;line-height:1.6;color:#6b665f"><strong style="color:#171717">BridgeWords Consulting Pte Ltd</strong><br>Strategic communications • crisis communications • reputation risk • executive counsel • mentoring<br><a href="https://bridgewords.sg/" style="color:#7b2937">bridgewords.sg</a> &nbsp;|&nbsp; <a href="mailto:weijoo.ng@bridgewords.sg" style="color:#7b2937">weijoo.ng@bridgewords.sg</a><br>UEN 201116732E</td></tr></table></td></tr></table></body></html>`;
}
async function send(token,payload){
  const r=await fetch(MAILTRAP_API,{method:'POST',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},body:JSON.stringify(payload)});
  if(!r.ok)throw new Error(`Mailtrap API error ${r.status}: ${await r.text()}`);
}
export default async function handler(req,res){
  if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});
  const token=process.env.MAILTRAP;
  if(!token)return res.status(500).json({error:'Mail service is not configured'});
  const name=String(req.body?.name||'').trim();
  const email=String(req.body?.email||'').trim();
  const message=String(req.body?.message||'').trim();
  if(!name||!validEmail(email)||message.length<10)return res.status(400).json({error:'Please complete all mandatory fields correctly.'});
  if(name.length>120||email.length>254||message.length>5000)return res.status(400).json({error:'Submission is too long.'});

  const sender={email:'amit@axon.com.sg',name:'BridgeWords Consulting Pte Ltd'};
  const replyTo={email:'nweijoo@gmail.com',name:'BridgeWords Consulting Pte Ltd'};
  const adminHtml=layout(`<h1 style="font-size:25px;margin:0 0 18px">New website enquiry</h1><p style="margin:0 0 18px;color:#4d4944">A new enquiry was submitted through the BridgeWords website.</p><table role="presentation" width="100%" cellpadding="8" cellspacing="0" style="border-collapse:collapse"><tr><td style="width:100px;font-weight:bold;border-bottom:1px solid #eee8e1">Name</td><td style="border-bottom:1px solid #eee8e1">${esc(name)}</td></tr><tr><td style="font-weight:bold;border-bottom:1px solid #eee8e1">Email</td><td style="border-bottom:1px solid #eee8e1"><a href="mailto:${esc(email)}" style="color:#7b2937">${esc(email)}</a></td></tr></table><h2 style="font-size:18px;margin:24px 0 8px">How can we help?</h2><div style="white-space:pre-wrap;line-height:1.7;color:#333">${esc(message)}</div>`);
  const customerHtml=layout(`<h1 style="font-size:25px;margin:0 0 18px">Thank you for contacting BridgeWords</h1><p style="line-height:1.7;color:#4d4944">Dear ${esc(name)},</p><p style="line-height:1.7;color:#4d4944">Thank you for getting in touch. We have received your enquiry and aim to respond within one working day.</p><div style="margin:24px 0;padding:18px;border-left:4px solid #7b2937;background:#faf8f5"><strong>Your message</strong><div style="white-space:pre-wrap;margin-top:8px;color:#4d4944">${esc(message)}</div></div><p style="line-height:1.7;color:#4d4944">If your matter is urgent, simply reply to this email and it will be directed to BridgeWords Consulting.</p><p style="margin-top:26px">Warm regards,<br><strong>BridgeWords Consulting Pte Ltd</strong></p>`);

  await send(token,{
    from:sender,
    to:[{email:'nweijoo@gmail.com'}],
    reply_to:{email,name},
    subject:`BridgeWords website enquiry — ${name}`,
    html:adminHtml,
    text:`New BridgeWords website enquiry\n\nName: ${name}\nEmail: ${email}\n\n${message}`,
    category:'BridgeWords Website'
  });
  await send(token,{
    from:sender,
    to:[{email,name}],
    reply_to:replyTo,
    subject:'Thank you for contacting BridgeWords Consulting',
    html:customerHtml,
    text:`Dear ${name},\n\nThank you for contacting BridgeWords Consulting. We have received your enquiry and aim to respond within one working day.\n\nYour message:\n${message}\n\nWarm regards,\nBridgeWords Consulting Pte Ltd`,
    category:'BridgeWords Acknowledgement'
  });

  return res.status(200).json({ok:true});
}
