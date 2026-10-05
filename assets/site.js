const b=document.querySelector('.menu-btn'),n=document.querySelector('.nav');
if(b&&n)b.addEventListener('click',()=>{const o=n.classList.toggle('open');b.setAttribute('aria-expanded',o)});
document.querySelectorAll('.nav a').forEach(a=>a.addEventListener('click',()=>n?.classList.remove('open')));

const f=document.querySelector('#contact-form');
if(f){
  const status=document.querySelector('#form-status');
  const submit=document.querySelector('#contact-submit');
  f.addEventListener('submit',async e=>{
    e.preventDefault();
    status.textContent='';
    if(!f.checkValidity()){
      f.reportValidity();
      status.textContent='Please complete all mandatory fields correctly.';
      return;
    }
    const d=new FormData(f);
    const payload={
      name:String(d.get('name')||'').trim(),
      email:String(d.get('email')||'').trim(),
      message:String(d.get('message')||'').trim()
    };
    submit.disabled=true;
    submit.textContent='Sending…';
    try{
      const endpoint=window.BRIDGEWORDS_CONTACT_API||'/api/contact';
      const r=await fetch(endpoint,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(payload)
      });
      const out=await r.json().catch(()=>({}));
      if(!r.ok)throw new Error(out.error||'Unable to send your enquiry.');
      f.reset();
      status.textContent='Thank you. Your enquiry has been sent successfully. Please check your email for our acknowledgement.';
    }catch(err){
      status.textContent='We could not send the form right now. Please email weijoo.ng@bridgewords.sg directly.';
    }finally{
      submit.disabled=false;
      submit.textContent='Send enquiry';
    }
  });
}
