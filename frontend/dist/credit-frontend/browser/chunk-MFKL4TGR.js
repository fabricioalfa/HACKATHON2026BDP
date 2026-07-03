import{a as X,b as Z}from"./chunk-PF7MQ5JN.js";import{b as G}from"./chunk-WFBYXRUF.js";import{a as Q}from"./chunk-JMKXP5LQ.js";import{m as J,n as K}from"./chunk-VV57HT3X.js";import{b as R,c as F,d as N,e as C,f as B,g as L,h as H,i as V}from"./chunk-5R3GNCEU.js";import"./chunk-OFLOCURC.js";import{a as j,j as A,k as U,l as q,m as Y}from"./chunk-RTBBOHGV.js";import{k,pa as b,t as T,u as W,za as $}from"./chunk-T2Z3OJUX.js";import{$ as E,Ab as c,Ba as p,Bb as u,Cb as v,Ha as P,Ia as z,Ja as D,La as I,M as x,N as S,S as _,Ua as y,Wa as O,Xb as M,ab as n,bb as r,cb as f,fa as w,kb as h,vb as l,wa as s,zb as m}from"./chunk-D4IMPIUR.js";var oe=({dt:e})=>`
.p-textarea {
    font-family: inherit;
    font-feature-settings: inherit;
    font-size: 1rem;
    color: ${e("textarea.color")};
    background: ${e("textarea.background")};
    padding: ${e("textarea.padding.y")} ${e("textarea.padding.x")};
    border: 1px solid ${e("textarea.border.color")};
    transition: background ${e("textarea.transition.duration")}, color ${e("textarea.transition.duration")}, border-color ${e("textarea.transition.duration")}, outline-color ${e("textarea.transition.duration")}, box-shadow ${e("textarea.transition.duration")};
    appearance: none;
    border-radius: ${e("textarea.border.radius")};
    outline-color: transparent;
    box-shadow: ${e("textarea.shadow")};
}

.p-textarea.ng-invalid.ng-dirty {
    border-color: ${e("textarea.invalid.border.color")};
}

.p-textarea:enabled:hover {
    border-color: ${e("textarea.hover.border.color")};
}

.p-textarea:enabled:focus {
    border-color: ${e("textarea.focus.border.color")};
    box-shadow: ${e("textarea.focus.ring.shadow")};
    outline: ${e("textarea.focus.ring.width")} ${e("textarea.focus.ring.style")} ${e("textarea.focus.ring.color")};
    outline-offset: ${e("textarea.focus.ring.offset")};
}

.p-textarea.p-invalid {
    border-color: ${e("textarea.invalid.border.color")};
}

.p-textarea.p-variant-filled {
    background: ${e("textarea.filled.background")};
}

.p-textarea.p-variant-filled:enabled:hover {
    background: ${e("textarea.filled.hover.background")};
}

.p-textarea.p-variant-filled:enabled:focus {
    background: ${e("textarea.filled.focus.background")};
}

.p-textarea:disabled {
    opacity: 1;
    background: ${e("textarea.disabled.background")};
    color: ${e("textarea.disabled.color")};
}

.p-textarea::placeholder {
    color: ${e("textarea.placeholder.color")};
}

.p-textarea.ng-invalid.ng-dirty::placeholder {
    color: ${e("textarea.invalid.placeholder.color")};
}

.p-textarea-fluid {
    width: 100%;
}

.p-textarea-resizable {
    overflow: hidden;
    resize: none;
}

.p-textarea-sm {
    font-size: ${e("textarea.sm.font.size")};
    padding-block: ${e("textarea.sm.padding.y")};
    padding-inline: ${e("textarea.sm.padding.x")};
}

.p-textarea-lg {
    font-size: ${e("textarea.lg.font.size")};
    padding-block: ${e("textarea.lg.padding.y")};
    padding-inline: ${e("textarea.lg.padding.x")};
}
`,ae={root:({instance:e,props:g})=>["p-textarea p-component",{"p-filled":e.filled,"p-textarea-resizable ":g.autoResize,"p-invalid":g.invalid,"p-variant-filled":g.variant?g.variant==="filled":e.config.inputStyle==="filled"||e.config.inputVariant==="filled","p-textarea-fluid":g.fluid}]},ee=(()=>{class e extends ${name="textarea";theme=oe;classes=ae;static \u0275fac=(()=>{let a;return function(t){return(a||(a=E(e)))(t||e)}})();static \u0275prov=x({token:e,factory:e.\u0275fac})}return e})();var te=(()=>{class e extends j{ngModel;control;autoResize;variant;fluid=!1;pSize;onResize=new w;filled;cachedScrollHeight;ngModelSubscription;ngControlSubscription;_componentStyle=_(ee);constructor(a,o){super(),this.ngModel=a,this.control=o}ngOnInit(){super.ngOnInit(),this.ngModel&&(this.ngModelSubscription=this.ngModel.valueChanges.subscribe(()=>{this.updateState()})),this.control&&(this.ngControlSubscription=this.control.valueChanges.subscribe(()=>{this.updateState()}))}get hasFluid(){let o=this.el.nativeElement.closest("p-fluid");return this.fluid||!!o}ngAfterViewInit(){super.ngAfterViewInit(),this.autoResize&&this.resize(),this.updateFilledState(),this.cd.detectChanges()}ngAfterViewChecked(){this.autoResize&&this.resize()}onInput(a){this.updateState()}updateFilledState(){this.filled=this.el.nativeElement.value&&this.el.nativeElement.value.length}resize(a){this.el.nativeElement.style.height="auto",this.el.nativeElement.style.height=this.el.nativeElement.scrollHeight+"px",parseFloat(this.el.nativeElement.style.height)>=parseFloat(this.el.nativeElement.style.maxHeight)?(this.el.nativeElement.style.overflowY="scroll",this.el.nativeElement.style.height=this.el.nativeElement.style.maxHeight):this.el.nativeElement.style.overflow="hidden",this.onResize.emit(a||{})}updateState(){this.updateFilledState(),this.autoResize&&this.resize()}ngOnDestroy(){this.ngModelSubscription&&this.ngModelSubscription.unsubscribe(),this.ngControlSubscription&&this.ngControlSubscription.unsubscribe(),super.ngOnDestroy()}static \u0275fac=function(o){return new(o||e)(p(C,8),p(F,8))};static \u0275dir=D({type:e,selectors:[["","pTextarea",""],["","pInputTextarea",""]],hostAttrs:[1,"p-textarea","p-component"],hostVars:16,hostBindings:function(o,t){o&1&&h("input",function(i){return t.onInput(i)}),o&2&&O("p-filled",t.filled)("p-textarea-resizable",t.autoResize)("p-variant-filled",t.variant==="filled"||t.config.inputStyle()==="filled"||t.config.inputVariant()==="filled")("p-textarea-fluid",t.hasFluid)("p-textarea-sm",t.pSize==="small")("p-inputfield-sm",t.pSize==="small")("p-textarea-lg",t.pSize==="large")("p-inputfield-lg",t.pSize==="large")},inputs:{autoResize:[2,"autoResize","autoResize",M],variant:"variant",fluid:[2,"fluid","fluid",M],pSize:"pSize"},outputs:{onResize:"onResize"},features:[v([ee]),I]})}return e})(),ie=(()=>{class e{static \u0275fac=function(o){return new(o||e)};static \u0275mod=z({type:e});static \u0275inj=S({})}return e})();var Le=(()=>{class e{certService;messageService;router;form={holderName:"",holderDocument:"",holderEmail:"",amount:0,currency:"USD",description:"",documentData:""};currencies=[{label:"USD",value:"USD"},{label:"EUR",value:"EUR"},{label:"PEN",value:"PEN"}];loading=!1;constructor(a,o,t){this.certService=a,this.messageService=o,this.router=t}onSubmit(){if(!this.form.holderName||!this.form.holderDocument||!this.form.amount||!this.form.documentData){this.messageService.add({severity:"warn",summary:"Campos requeridos",detail:"Complete todos los campos obligatorios"});return}this.loading=!0,this.certService.create(this.form).subscribe({next:()=>{this.messageService.add({severity:"success",summary:"Exito",detail:"Certificado emitido correctamente"}),setTimeout(()=>this.router.navigate(["/certificates"]),1e3)},error:a=>{this.messageService.add({severity:"error",summary:"Error",detail:a.error?.message||"Error al emitir"}),this.loading=!1}})}static \u0275fac=function(o){return new(o||e)(p(Q),p(b),p(T))};static \u0275cmp=P({type:e,selectors:[["app-issue-certificate"]],features:[v([b])],decls:59,vars:9,consts:[[1,"layout"],[1,"sidebar"],[1,"sidebar-header"],[1,"pi","pi-shield"],[1,"nav-menu"],["routerLink","/dashboard"],[1,"pi","pi-home"],["routerLink","/certificates"],[1,"pi","pi-file"],["routerLink","/certificates/new",1,"active"],[1,"pi","pi-plus-circle"],[1,"sidebar-footer"],[1,"content"],[1,"form-grid"],[1,"field"],["pInputText","",1,"w-full",3,"ngModelChange","ngModel"],["pInputText","","type","number",1,"w-full",3,"ngModelChange","ngModel"],[1,"w-full",3,"ngModelChange","options","ngModel"],[1,"field","full"],["pTextarea","","rows","3",1,"w-full",3,"ngModelChange","ngModel"],["pTextarea","","rows","4","placeholder","Contenido del documento para generar hash...",1,"w-full",3,"ngModelChange","ngModel"],[1,"actions"],["label","Cancelar","routerLink","/certificates",1,"p-button-secondary"],["label","Emitir Certificado","icon","pi pi-check",3,"onClick","loading"]],template:function(o,t){o&1&&(n(0,"div",0)(1,"nav",1)(2,"div",2),f(3,"i",3),n(4,"span"),l(5,"CreditCerts"),r()(),n(6,"ul",4)(7,"li")(8,"a",5),f(9,"i",6),l(10," Dashboard"),r()(),n(11,"li")(12,"a",7),f(13,"i",8),l(14," Certificados"),r()(),n(15,"li")(16,"a",9),f(17,"i",10),l(18," Emitir"),r()()(),n(19,"div",11)(20,"small"),l(21,"Emitir Certificado"),r()()(),n(22,"main",12),f(23,"p-toast"),n(24,"h2"),l(25,"Emitir Nuevo Certificado"),r(),n(26,"p-card")(27,"div",13)(28,"div",14)(29,"label"),l(30,"Nombre del Titular *"),r(),n(31,"input",15),u("ngModelChange",function(i){return c(t.form.holderName,i)||(t.form.holderName=i),i}),r()(),n(32,"div",14)(33,"label"),l(34,"Documento *"),r(),n(35,"input",15),u("ngModelChange",function(i){return c(t.form.holderDocument,i)||(t.form.holderDocument=i),i}),r()(),n(36,"div",14)(37,"label"),l(38,"Email"),r(),n(39,"input",15),u("ngModelChange",function(i){return c(t.form.holderEmail,i)||(t.form.holderEmail=i),i}),r()(),n(40,"div",14)(41,"label"),l(42,"Monto *"),r(),n(43,"input",16),u("ngModelChange",function(i){return c(t.form.amount,i)||(t.form.amount=i),i}),r()(),n(44,"div",14)(45,"label"),l(46,"Moneda"),r(),n(47,"p-select",17),u("ngModelChange",function(i){return c(t.form.currency,i)||(t.form.currency=i),i}),r()(),n(48,"div",18)(49,"label"),l(50,"Descripcion"),r(),n(51,"textarea",19),u("ngModelChange",function(i){return c(t.form.description,i)||(t.form.description=i),i}),r()(),n(52,"div",18)(53,"label"),l(54,"Datos del Documento *"),r(),n(55,"textarea",20),u("ngModelChange",function(i){return c(t.form.documentData,i)||(t.form.documentData=i),i}),r()()(),n(56,"div",21),f(57,"p-button",22),n(58,"p-button",23),h("onClick",function(){return t.onSubmit()}),r()()()()()),o&2&&(s(31),m("ngModel",t.form.holderName),s(4),m("ngModel",t.form.holderDocument),s(4),m("ngModel",t.form.holderEmail),s(4),m("ngModel",t.form.amount),s(4),y("options",t.currencies),m("ngModel",t.form.currency),s(4),m("ngModel",t.form.description),s(4),m("ngModel",t.form.documentData),s(3),y("loading",t.loading))},dependencies:[k,L,R,B,N,C,W,Y,q,U,A,V,H,ie,te,K,J,G,Z,X],styles:[".layout[_ngcontent-%COMP%]{display:flex;min-height:100vh}.sidebar[_ngcontent-%COMP%]{width:240px;background:#1e3c72;color:#fff;display:flex;flex-direction:column;position:fixed;height:100vh}.sidebar-header[_ngcontent-%COMP%]{padding:1.25rem;display:flex;align-items:center;gap:.75rem;font-size:1.2rem;font-weight:700;border-bottom:1px solid rgba(255,255,255,.1)}.sidebar-header[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]{font-size:1.5rem}.nav-menu[_ngcontent-%COMP%]{list-style:none;padding:1rem 0;margin:0}.nav-menu[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{display:flex;align-items:center;gap:.75rem;padding:.75rem 1.25rem;color:#fffc;text-decoration:none;transition:all .2s}.nav-menu[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover, .nav-menu[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]   a.active[_ngcontent-%COMP%]{background:#ffffff1a;color:#fff}.sidebar-footer[_ngcontent-%COMP%]{padding:1rem;border-top:1px solid rgba(255,255,255,.1)}.content[_ngcontent-%COMP%]{margin-left:240px;padding:2rem;flex:1}.form-grid[_ngcontent-%COMP%]{display:grid;grid-template-columns:1fr 1fr;gap:1rem}.field[_ngcontent-%COMP%]{margin-bottom:1rem}.field[_ngcontent-%COMP%]   label[_ngcontent-%COMP%]{display:block;margin-bottom:.5rem;font-weight:600;color:#333}.full[_ngcontent-%COMP%]{grid-column:span 2}.w-full[_ngcontent-%COMP%]{width:100%}.actions[_ngcontent-%COMP%]{display:flex;gap:1rem;justify-content:flex-end;margin-top:1rem;padding-top:1rem;border-top:1px solid #eee}"]})}return e})();export{Le as IssueCertificateComponent};
