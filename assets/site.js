const b=document.querySelector('.menu-btn'),n=document.querySelector('.nav');
if(b&&n)b.addEventListener('click',()=>{const o=n.classList.toggle('open');b.setAttribute('aria-expanded',o)});
document.querySelectorAll('.nav a').forEach(a=>a.addEventListener('click',()=>n?.classList.remove('open')));

const f=document.querySelector('#contact-form');
if(f){
  const status=document.querySelector('#form-status');
  f.addEventListener('submit',e=>{
    e.preventDefault();
    status.textContent='';
    if(!f.checkValidity()){
      f.reportValidity();
      status.textContent='Please complete all mandatory fields correctly.';
      return;
    }

    const d=new FormData(f);
    const name=String(d.get('name')||'').trim();
    const email=String(d.get('email')||'').trim();
    const message=String(d.get('message')||'').trim();

    const text=[
      'Hello BridgeWords Consulting,',
      '',
      'I would like to send an enquiry from the BridgeWords website.',
      '',
      'Name: '+name,
      'Email: '+email,
      '',
      'How can we help?',
      message
    ].join('\n');

    const url='https://wa.me/6598293211?text='+encodeURIComponent(text);
    window.open(url,'_blank','noopener');
    status.textContent='WhatsApp has been opened with your enquiry ready to send.';
  });
}
