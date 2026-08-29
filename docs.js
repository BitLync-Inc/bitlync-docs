(function(){
  function setDocsFolder(btn, open){
    btn.setAttribute('aria-expanded', open?'true':'false');
    var body=document.getElementById(btn.getAttribute('aria-controls'));
    if(body) body.hidden=!open;
  }
  function closeDocsFolders(except){
    document.querySelectorAll('.docs-fold').forEach(function(b){
      if(b!==except) setDocsFolder(b, false);
    });
  }
  document.querySelectorAll('.docs-fold').forEach(function(btn){
    btn.addEventListener('click', function(e){
      e.preventDefault();
      e.stopPropagation();
      var open=btn.getAttribute('aria-expanded')==='true';
      closeDocsFolders();
      if(!open) setDocsFolder(btn, true);
    });
  });
  var on=document.querySelector('.docs-fold-body a.on');
  if(on){
    var folder=on.closest('.docs-folder');
    var btn=folder && folder.querySelector('.docs-fold');
    if(btn){ closeDocsFolders(); setDocsFolder(btn, true); }
  }

  function fallbackCopy(txt){
    var ta=document.createElement('textarea');
    ta.value=txt;
    ta.setAttribute('readonly','');
    ta.style.position='fixed';
    ta.style.left='-9999px';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    var ok=false;
    try{ ok=document.execCommand('copy'); }catch(err){ ok=false; }
    document.body.removeChild(ta);
    return ok;
  }
  function markCopied(btn){
    if(!btn || btn.tagName!=='BUTTON' || !btn.classList.contains('copy')) return;
    btn.textContent='Copied';
    clearTimeout(btn._copyTimer);
    btn._copyTimer=setTimeout(function(){ btn.textContent='Copy'; }, 1500);
  }
  function copyText(txt, btn){
    if(!txt) return;
    function done(){ markCopied(btn); }
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(txt).then(done).catch(function(){
        if(fallbackCopy(txt)) done();
      });
    } else if(fallbackCopy(txt)){
      done();
    }
  }
  document.addEventListener('click', function(e){
    var field=e.target.closest('button.copy,[data-copy],[data-goto]');
    if(!field) return;
    var copyEl=e.target.closest('button.copy,[data-copy]');
    if(copyEl){
      var txt=copyEl.getAttribute('data-copy');
      var btn=copyEl.classList.contains('copy')?copyEl:null;
      copyText(txt, btn);
    }
    var goto=field.getAttribute('data-goto');
    if(goto){
      var dest='/reference/#'+goto;
      var here=(location.pathname.replace(/\/+$/,'')||'/') === '/reference';
      var el=document.getElementById(goto);
      if(here && el){
        history.replaceState(null,'','#'+goto);
        el.scrollIntoView({block:'start'});
      } else {
        location.href=dest;
      }
    }
  });

  var rail=document.getElementById('docsRail');
  if(rail){
    var codes=document.querySelectorAll('.docs-main .code');
    if(!codes.length){ rail.hidden=true; }
    else {
      rail.hidden=false;
      codes.forEach(function(c){ rail.appendChild(c.cloneNode(true)); });
    }
  }
  if(location.hash){
    var t=document.getElementById(location.hash.slice(1));
    if(t) setTimeout(function(){ t.scrollIntoView({block:'start'}); }, 30);
  }
})();
