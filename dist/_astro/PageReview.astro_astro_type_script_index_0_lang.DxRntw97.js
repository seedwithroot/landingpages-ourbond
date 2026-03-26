(function(){if(!new URLSearchParams(location.search).has("review"))return;const y="pr:"+location.pathname,n={comments:[],nextId:1,placing:!1,panelOpen:!0};try{const e=JSON.parse(localStorage.getItem(y)||"null");e&&Array.isArray(e.comments)&&(n.comments=e.comments,n.nextId=n.comments.length?Math.max(...n.comments.map(t=>t.num))+1:1)}catch{}function w(){localStorage.setItem(y,JSON.stringify({comments:n.comments}))}const C=`
    body { position: relative !important; }

    /* ── Pin layer ── */
    #pr-pin-layer {
      position: absolute; top: 0; left: 0; width: 100%;
      pointer-events: none; z-index: 9000;
    }

    /* ── Placing crosshair overlay ── */
    #pr-placing-overlay {
      position: fixed; inset: 0; z-index: 9001;
      cursor: crosshair;
      background: rgba(37,99,235,0.07);
      display: none;
    }
    #pr-placing-overlay.active { display: block; }
    #pr-placing-hint {
      position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
      background: rgba(15,15,30,0.85); color: #fff;
      padding: 10px 20px; border-radius: 8px;
      font: 13px/1 'Barlow', sans-serif; white-space: nowrap;
      pointer-events: none; z-index: 9002;
    }

    /* ── Pin ── */
    .pr-pin {
      position: absolute;
      width: 30px; height: 30px; margin-top: -30px; margin-left: -8px;
      border-radius: 50% 50% 50% 0; transform: rotate(-45deg);
      background: #f59e0b; border: 2px solid #fff;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      cursor: pointer; pointer-events: all;
      display: flex; align-items: center; justify-content: center;
      transition: background 0.15s, transform 0.15s;
    }
    .pr-pin:hover { background: #d97706; }
    .pr-pin.active-pin { background: #2563eb; }
    .pr-pin .pr-num {
      transform: rotate(45deg);
      font: 700 11px/1 'Barlow', sans-serif;
      color: #fff; user-select: none;
    }

    /* ── Comment bubble ── */
    .pr-bubble {
      position: absolute; top: 10px; left: 32px;
      background: #fff; border: 1px solid #e5e7eb;
      border-radius: 10px; padding: 12px 14px;
      min-width: 230px; max-width: 300px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.14);
      z-index: 9002; font-family: 'Barlow', sans-serif;
      font-size: 13px; pointer-events: all;
      display: none;
    }
    .pr-bubble.visible { display: block; }
    .pr-bubble .prb-meta { display: flex; align-items: baseline; gap: 6px; }
    .pr-bubble .prb-author { font-weight: 700; color: #1e1e2e; }
    .pr-bubble .prb-date { font-size: 11px; color: #9ca3af; }
    .pr-bubble .prb-text { margin-top: 7px; color: #374151; line-height: 1.55; }
    .pr-bubble .prb-del {
      margin-top: 9px; font-size: 11px; cursor: pointer;
      color: #ef4444; background: none; border: none; padding: 0;
      font-family: inherit;
    }
    .pr-bubble .prb-del:hover { color: #b91c1c; text-decoration: underline; }

    /* ── Toolbar ── */
    #pr-toolbar {
      position: fixed; bottom: 20px; right: 20px; z-index: 9999;
      background: #1e1e2e; border-radius: 12px;
      padding: 10px 14px; display: flex; align-items: center; gap: 10px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.35);
      font-family: 'Barlow', sans-serif; font-size: 13px;
      flex-wrap: wrap; max-width: calc(100vw - 40px);
    }
    #pr-toolbar .pr-reviewer-label {
      color: #9ca3af; font-size: 12px; white-space: nowrap;
    }
    #pr-name-input {
      background: transparent; border: 1px solid #374151;
      color: #fff; border-radius: 6px; padding: 5px 8px;
      font: 12px 'Barlow', sans-serif; width: 110px; outline: none;
    }
    #pr-name-input:focus { border-color: #2563eb; }
    #pr-name-input::placeholder { color: #6b7280; }
    #pr-toolbar button {
      background: #374151; border: none; color: #d1d5db;
      border-radius: 6px; padding: 6px 12px; cursor: pointer;
      font: 12px 'Barlow', sans-serif; white-space: nowrap;
      transition: background 0.15s, color 0.15s;
    }
    #pr-toolbar button:hover { background: #4b5563; color: #fff; }
    #pr-btn-add { background: #2563eb !important; color: #fff !important; }
    #pr-btn-add:hover { background: #1d4ed8 !important; }
    #pr-btn-add.placing { background: #ef4444 !important; }
    #pr-btn-add.placing:hover { background: #b91c1c !important; }
    #pr-count-badge {
      background: #f59e0b; color: #fff; border-radius: 999px;
      padding: 2px 8px; font: 700 11px 'Barlow', sans-serif;
      min-width: 22px; text-align: center;
    }

    /* ── Side panel ── */
    #pr-panel {
      position: fixed; right: 0; top: 0; bottom: 0; width: 310px;
      background: #fff; border-left: 1px solid #e5e7eb;
      box-shadow: -4px 0 24px rgba(0,0,0,0.12);
      z-index: 9998; display: flex; flex-direction: column;
      transform: translateX(100%); transition: transform 0.25s ease;
      font-family: 'Barlow', sans-serif;
    }
    #pr-panel.open { transform: translateX(0); }
    #pr-panel-head {
      background: #1e1e2e; color: #fff; padding: 14px 16px;
      font: 600 14px 'Barlow', sans-serif;
      display: flex; justify-content: space-between; align-items: center;
      flex-shrink: 0;
    }
    #pr-panel-head button {
      background: none; border: none; color: #9ca3af;
      font-size: 20px; line-height: 1; cursor: pointer; padding: 0;
    }
    #pr-panel-head button:hover { color: #fff; }
    #pr-panel-body { overflow-y: auto; flex: 1; }
    .pr-empty {
      padding: 36px 20px; text-align: center;
      color: #9ca3af; font-size: 13px; line-height: 1.7;
    }
    .pr-ci {
      padding: 12px 16px; border-bottom: 1px solid #f3f4f6;
      cursor: pointer; transition: background 0.1s;
    }
    .pr-ci:hover { background: #f9fafb; }
    .pr-ci-head { display: flex; align-items: center; gap: 8px; margin-bottom: 5px; }
    .pr-ci-num {
      width: 22px; height: 22px; border-radius: 50%;
      background: #f59e0b; color: #fff;
      font: 700 11px 'Barlow', sans-serif;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .pr-ci-author { font-weight: 700; font-size: 13px; color: #1e1e2e; }
    .pr-ci-date { font-size: 11px; color: #9ca3af; margin-left: auto; }
    .pr-ci-text { font-size: 13px; color: #374151; line-height: 1.55; padding-left: 30px; }
    .pr-ci-del {
      display: block; margin: 6px 0 0 30px;
      font-size: 11px; color: #ef4444; cursor: pointer;
      background: none; border: none; padding: 0;
      font-family: inherit;
    }
    .pr-ci-del:hover { text-decoration: underline; }

    /* ── Comment input modal ── */
    #pr-modal {
      position: fixed; inset: 0; z-index: 10000;
      background: rgba(0,0,0,0.45);
      display: none; align-items: center; justify-content: center;
    }
    #pr-modal.visible { display: flex; }
    #pr-modal-box {
      background: #fff; border-radius: 12px; padding: 24px;
      width: 380px; max-width: calc(100vw - 40px);
      box-shadow: 0 20px 60px rgba(0,0,0,0.25);
      font-family: 'Barlow', sans-serif;
    }
    #pr-modal-box h3 { margin: 0 0 14px; font-size: 16px; color: #1e1e2e; }
    #pr-comment-ta {
      width: 100%; box-sizing: border-box; padding: 10px 12px;
      border: 1px solid #d1d5db; border-radius: 8px;
      font: 14px/1.55 'Barlow', sans-serif;
      resize: vertical; min-height: 90px; outline: none;
    }
    #pr-comment-ta:focus { border-color: #2563eb; }
    #pr-modal-hint {
      font-size: 11px; color: #9ca3af; margin-top: 6px;
    }
    #pr-modal-actions {
      display: flex; gap: 8px; justify-content: flex-end; margin-top: 14px;
    }
    #pr-modal-actions button {
      border: none; border-radius: 6px; padding: 8px 18px;
      cursor: pointer; font: 13px 'Barlow', sans-serif;
    }
    #pr-btn-cancel-modal { background: #f3f4f6; color: #374151; }
    #pr-btn-cancel-modal:hover { background: #e5e7eb; }
    #pr-btn-save-modal { background: #2563eb; color: #fff; }
    #pr-btn-save-modal:hover { background: #1d4ed8; }
  `,E=document.createElement("style");E.textContent=C,document.head.appendChild(E);const p=document.createElement("div");p.id="pr-pin-layer",document.body.appendChild(p);const l=document.createElement("div");l.id="pr-placing-overlay";const u=document.createElement("div");u.id="pr-placing-hint",u.textContent="Click anywhere to drop a comment — Esc to cancel",l.appendChild(u),document.body.appendChild(l);const f=document.createElement("div");f.id="pr-toolbar",f.innerHTML=`
    <span class="pr-reviewer-label">Reviewing as:</span>
    <input id="pr-name-input" type="text" placeholder="Your name" autocomplete="off" />
    <button id="pr-btn-add">+ Add Comment</button>
    <span id="pr-count-badge">0</span>
    <button id="pr-btn-panel">☰ Comments</button>
    <button id="pr-btn-copy">Copy All</button>
  `,document.body.appendChild(f);const a=document.createElement("div");a.id="pr-modal",a.innerHTML=`
    <div id="pr-modal-box">
      <h3>Add a comment</h3>
      <textarea id="pr-comment-ta" placeholder="Describe your feedback or requested change…"></textarea>
      <div id="pr-modal-hint">Tip: Ctrl+Enter to save</div>
      <div id="pr-modal-actions">
        <button id="pr-btn-cancel-modal">Cancel</button>
        <button id="pr-btn-save-modal">Save Comment</button>
      </div>
    </div>
  `,document.body.appendChild(a);const s=document.createElement("div");s.id="pr-panel",s.innerHTML=`
    <div id="pr-panel-head">
      <span>Page Comments</span>
      <button id="pr-panel-close" aria-label="Close">×</button>
    </div>
    <div id="pr-panel-body"></div>
  `,document.body.appendChild(s);function c(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function b(){return{w:Math.max(document.body.scrollWidth,document.documentElement.scrollWidth),h:Math.max(document.body.scrollHeight,document.documentElement.scrollHeight)}}function x(){document.getElementById("pr-count-badge").textContent=n.comments.length;const{h:e}=b();p.style.height=e+"px",p.innerHTML="",n.comments.forEach(t=>{const o=document.createElement("div");o.style.cssText=`position:absolute;left:${t.x}%;top:${t.y}%;`;const r=document.createElement("div");r.className="pr-pin",r.dataset.id=t.id,r.innerHTML=`<span class="pr-num">${t.num}</span>`;const i=document.createElement("div");i.className="pr-bubble",i.innerHTML=`
        <div class="prb-meta">
          <span class="prb-author">${c(t.author)}</span>
          <span class="prb-date">${c(t.date)}</span>
        </div>
        <div class="prb-text">${c(t.text)}</div>
        <button class="prb-del" data-id="${t.id}">Delete comment</button>
      `,r.addEventListener("click",m=>{m.stopPropagation();const S=i.classList.contains("visible");g(),S||(i.classList.add("visible"),r.classList.add("active-pin"))}),i.querySelector(".prb-del").addEventListener("click",m=>{m.stopPropagation(),k(t.id)}),o.appendChild(r),o.appendChild(i),p.appendChild(o)}),B()}function B(){const e=document.getElementById("pr-panel-body");if(n.comments.length===0){e.innerHTML='<div class="pr-empty">No comments yet.<br/>Click <strong>+ Add Comment</strong> and then<br/>click anywhere on the page.</div>';return}e.innerHTML=n.comments.map(t=>`
      <div class="pr-ci" data-id="${t.id}">
        <div class="pr-ci-head">
          <div class="pr-ci-num">${t.num}</div>
          <span class="pr-ci-author">${c(t.author)}</span>
          <span class="pr-ci-date">${c(t.date)}</span>
        </div>
        <div class="pr-ci-text">${c(t.text)}</div>
        <button class="pr-ci-del" data-id="${t.id}">Delete</button>
      </div>`).join(""),e.querySelectorAll(".pr-ci").forEach(t=>{t.addEventListener("click",o=>{if(o.target.closest(".pr-ci-del"))return;const r=n.comments.find(m=>m.id===parseInt(t.dataset.id));if(!r)return;const{h:i}=b();window.scrollTo({top:r.y/100*i-160,behavior:"smooth"})})}),e.querySelectorAll(".pr-ci-del").forEach(t=>{t.addEventListener("click",o=>{o.stopPropagation(),k(parseInt(t.dataset.id))})})}function g(){document.querySelectorAll(".pr-bubble.visible").forEach(e=>e.classList.remove("visible")),document.querySelectorAll(".pr-pin.active-pin").forEach(e=>e.classList.remove("active-pin"))}let d=null;function I(){n.placing=!0,l.classList.add("active"),document.getElementById("pr-btn-add").classList.add("placing"),document.getElementById("pr-btn-add").textContent="✕ Cancel"}function h(){n.placing=!1,l.classList.remove("active");const e=document.getElementById("pr-btn-add");e.classList.remove("placing"),e.textContent="+ Add Comment"}function k(e){n.comments=n.comments.filter(t=>t.id!==e),w(),x()}function L(){const e=document.getElementById("pr-comment-ta").value.trim();if(!e||!d)return;const t=document.getElementById("pr-name-input").value.trim()||"Reviewer";n.comments.push({id:Date.now(),num:n.nextId++,x:d.x,y:d.y,text:e,author:t,date:new Date().toLocaleString("en-US",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}),w(),d=null,a.classList.remove("visible"),x()}function z(){if(n.comments.length===0){alert("No comments to copy yet.");return}const e=[`Page Review — ${location.href.split("?")[0]}`,`Exported: ${new Date().toLocaleString()}`,`Total comments: ${n.comments.length}`,""];n.comments.forEach(t=>{e.push(`[${t.num}] ${t.author} — ${t.date}`),e.push(t.text),e.push("")}),navigator.clipboard.writeText(e.join(`
`)).then(()=>{const t=document.getElementById("pr-btn-copy"),o=t.textContent;t.textContent="✓ Copied!",setTimeout(()=>{t.textContent=o},2200)})}const v=document.getElementById("pr-name-input");v.value=localStorage.getItem("pr-reviewer-name")||"",v.addEventListener("input",()=>{localStorage.setItem("pr-reviewer-name",v.value)}),document.getElementById("pr-btn-add").addEventListener("click",()=>{n.placing?h():I()}),document.getElementById("pr-btn-panel").addEventListener("click",()=>{n.panelOpen=!n.panelOpen,s.classList.toggle("open",n.panelOpen)}),document.getElementById("pr-panel-close").addEventListener("click",()=>{n.panelOpen=!1,s.classList.remove("open")}),document.getElementById("pr-btn-copy").addEventListener("click",z),l.addEventListener("click",e=>{const{w:t,h:o}=b();d={x:parseFloat(((e.clientX+window.scrollX)/t*100).toFixed(3)),y:parseFloat(((e.clientY+window.scrollY)/o*100).toFixed(3))},h(),document.getElementById("pr-comment-ta").value="",a.classList.add("visible"),setTimeout(()=>document.getElementById("pr-comment-ta").focus(),40)}),document.getElementById("pr-btn-save-modal").addEventListener("click",L),document.getElementById("pr-btn-cancel-modal").addEventListener("click",()=>{a.classList.remove("visible"),d=null}),document.getElementById("pr-comment-ta").addEventListener("keydown",e=>{e.key==="Enter"&&(e.ctrlKey||e.metaKey)&&L()}),document.addEventListener("click",e=>{!e.target.closest(".pr-pin")&&!e.target.closest(".pr-bubble")&&g()}),document.addEventListener("keydown",e=>{if(e.key==="Escape"){if(a.classList.contains("visible")){a.classList.remove("visible"),d=null;return}h(),g()}}),window.addEventListener("resize",()=>{const{h:e}=b();p.style.height=e+"px"}),s.classList.add("open"),x()})();
