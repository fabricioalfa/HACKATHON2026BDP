import{a as te}from"./chunk-SDXNCO3X.js";import{a as pe}from"./chunk-JMKXP5LQ.js";import{a as se,b as le}from"./chunk-RSC7TMJR.js";import{a as ie,j as ne,k as re,l as ae,m as oe}from"./chunk-RTBBOHGV.js";import{c as q,e as _,f as H,g as J,h as G,i as K,j as U,k as S,r as W,ta as Y,u as X,ua as Z,za as ee}from"./chunk-T2Z3OJUX.js";import{$ as M,Ba as v,Cb as V,Eb as R,Fb as $,Ha as b,La as j,M as O,Mb as x,Na as u,Nb as z,Ob as k,S as T,Ta as g,Ua as l,Va as y,Xb as Q,Y as D,Ya as C,Yb as L,Z as B,ab as n,bb as i,cb as p,fb as F,gb as N,kb as A,lb as m,ob as I,qb as P,rb as E,vb as r,wa as o,wb as d,yb as h}from"./chunk-D4IMPIUR.js";var ge=["content"],fe=(t,c)=>({"p-progressbar p-component":!0,"p-progressbar-determinate":t,"p-progressbar-indeterminate":c}),ve=t=>({$implicit:t});function be(t,c){if(t&1&&(n(0,"div"),r(1),i()),t&2){let e=m(2);y("display",e.value!=null&&e.value!==0?"flex":"none"),g("data-pc-section","label"),o(),h("",e.value,"",e.unit,"")}}function ye(t,c){t&1&&F(0)}function Ce(t,c){if(t&1&&(n(0,"div",3)(1,"div",4),u(2,be,2,5,"div",5)(3,ye,1,0,"ng-container",6),i()()),t&2){let e=m();C(e.valueStyleClass),y("width",e.value+"%")("background",e.color),l("ngClass","p-progressbar-value p-progressbar-value-animate"),g("data-pc-section","value"),o(2),l("ngIf",e.showValue&&!e.contentTemplate&&!e._contentTemplate),o(),l("ngTemplateOutlet",e.contentTemplate||e._contentTemplate)("ngTemplateOutletContext",R(11,ve,e.value))}}function he(t,c){if(t&1&&(n(0,"div",7),p(1,"div",8),i()),t&2){let e=m();C(e.valueStyleClass),l("ngClass","p-progressbar-indeterminate-container"),g("data-pc-section","container"),o(),y("background",e.color),g("data-pc-section","value")}}var xe=({dt:t})=>`
.p-progressbar {
    position: relative;
    overflow: hidden;
    height: ${t("progressbar.height")};
    background: ${t("progressbar.background")};
    border-radius: ${t("progressbar.border.radius")};
}

.p-progressbar-value {
    margin: 0;
    background: ${t("progressbar.value.background")};
}

.p-progressbar-label {
    color: ${t("progressbar.label.color")};
    font-size: ${t("progressbar.label.font.size")};
    font-weight: ${t("progressbar.label.font.weight")};
}

.p-progressbar-determinate .p-progressbar-value {
    height: 100%;
    width: 0%;
    position: absolute;
    display: none;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    transition: width 1s ease-in-out;
}

.p-progressbar-determinate .p-progressbar-label {
    display: inline-flex;
}

.p-progressbar-indeterminate .p-progressbar-value::before {
    content: "";
    position: absolute;
    background: inherit;
    top: 0;
    inset-inline-start: 0;
    bottom: 0;
    will-change: inset-inline-start, inset-inline-end;
    animation: p-progressbar-indeterminate-anim 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;
}

.p-progressbar-indeterminate .p-progressbar-value::after {
    content: "";
    position: absolute;
    background: inherit;
    top: 0;
    inset-inline-start: 0;
    bottom: 0;
    will-change: inset-inline-start, inset-inline-end;
    animation: p-progressbar-indeterminate-anim-short 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) infinite;
    animation-delay: 1.15s;
}

@-webkit-keyframes p-progressbar-indeterminate-anim {
    0% {
        inset-inline-start: -35%;
        inset-inline-end: 100%;
    }
    60% {
        inset-inline-start: 100%;
        inset-inline-end: -90%;
    }
    100% {
        inset-inline-start: 100%;
        inset-inline-end: -90%;
    }
}
@keyframes p-progressbar-indeterminate-anim {
    0% {
        inset-inline-start: -35%;
        inset-inline-end: 100%;
    }
    60% {
        inset-inline-start: 100%;
        inset-inline-end: -90%;
    }
    100% {
        inset-inline-start: 100%;
        inset-inline-end: -90%;
    }
}
@-webkit-keyframes p-progressbar-indeterminate-anim-short {
    0% {
        inset-inline-start: -200%;
        inset-inline-end: 100%;
    }
    60% {
        inset-inline-start: 107%;
        inset-inline-end: -8%;
    }
    100% {
        inset-inline-start: 107%;
        inset-inline-end: -8%;
    }
}
@keyframes p-progressbar-indeterminate-anim-short {
    0% {
        inset-inline-start: -200%;
        inset-inline-end: 100%;
    }
    60% {
        inset-inline-start: 107%;
        inset-inline-end: -8%;
    }
    100% {
        inset-inline-start: 107%;
        inset-inline-end: -8%;
    }
}
`,_e={root:({instance:t})=>["p-progressbar p-component",{"p-progressbar-determinate":t.determinate,"p-progressbar-indeterminate":t.indeterminate}],value:"p-progressbar-value",label:"p-progressbar-label"},de=(()=>{class t extends ee{name="progressbar";theme=xe;classes=_e;static \u0275fac=(()=>{let e;return function(a){return(e||(e=M(t)))(a||t)}})();static \u0275prov=O({token:t,factory:t.\u0275fac})}return t})();var ce=(()=>{class t extends ie{value;showValue=!0;styleClass;valueStyleClass;style;unit="%";mode="determinate";color;contentTemplate;_componentStyle=T(de);templates;_contentTemplate;ngAfterContentInit(){this.templates?.forEach(e=>{e.getType()==="content"?this._contentTemplate=e.template:this._contentTemplate=e.template})}static \u0275fac=(()=>{let e;return function(a){return(e||(e=M(t)))(a||t)}})();static \u0275cmp=b({type:t,selectors:[["p-progressBar"],["p-progressbar"],["p-progress-bar"]],contentQueries:function(s,a,w){if(s&1&&(I(w,ge,4),I(w,Y,4)),s&2){let f;P(f=E())&&(a.contentTemplate=f.first),P(f=E())&&(a.templates=f)}},inputs:{value:[2,"value","value",L],showValue:[2,"showValue","showValue",Q],styleClass:"styleClass",valueStyleClass:"valueStyleClass",style:"style",unit:"unit",mode:"mode",color:"color"},features:[V([de]),j],decls:3,vars:15,consts:[["role","progressbar",3,"ngStyle","ngClass"],["style","display:flex",3,"ngClass","class","width","background",4,"ngIf"],[3,"ngClass","class",4,"ngIf"],[2,"display","flex",3,"ngClass"],[1,"p-progressbar-label"],[3,"display",4,"ngIf"],[4,"ngTemplateOutlet","ngTemplateOutletContext"],[3,"ngClass"],[1,"p-progressbar-value","p-progressbar-value-animate"]],template:function(s,a){s&1&&(n(0,"div",0),u(1,Ce,4,13,"div",1)(2,he,2,7,"div",2),i()),s&2&&(C(a.styleClass),l("ngStyle",a.style)("ngClass",$(12,fe,a.mode==="determinate",a.mode==="indeterminate")),g("aria-valuemin",0)("aria-valuenow",a.value)("aria-valuemax",100)("data-pc-name","progressbar")("data-pc-section","root")("aria-label",a.value+a.unit),o(),l("ngIf",a.mode==="determinate"),o(),l("ngIf",a.mode==="indeterminate"))},dependencies:[S,q,_,J,H,Z],encapsulation:2,changeDetection:0})}return t})();function Se(t,c){t&1&&(n(0,"div",14),p(1,"p-progressBar",15),i())}function Me(t,c){if(t&1){let e=N();n(0,"div",26)(1,"p-button",27),A("onClick",function(){D(e);let a=m(2);return B(a.revoke())}),i()()}}function Ie(t,c){if(t&1&&(n(0,"div")(1,"div",16)(2,"p-card",17)(3,"div",18)(4,"span",19),r(5,"Nombre:"),i(),n(6,"span"),r(7),i()(),n(8,"div",18)(9,"span",19),r(10,"Documento:"),i(),n(11,"span"),r(12),i()(),n(13,"div",18)(14,"span",19),r(15,"Email:"),i(),n(16,"span"),r(17),i()()(),n(18,"p-card",20)(19,"div",18)(20,"span",19),r(21,"Monto:"),i(),n(22,"span"),r(23),x(24,"number"),i()(),n(25,"div",18)(26,"span",19),r(27,"Moneda:"),i(),n(28,"span"),r(29),i()(),n(30,"div",18)(31,"span",19),r(32,"Descripcion:"),i(),n(33,"span"),r(34),i()()(),n(35,"p-card",21)(36,"div",18)(37,"span",19),r(38,"Estado:"),i(),p(39,"p-tag",22),i(),n(40,"div",18)(41,"span",19),r(42,"Creado:"),i(),n(43,"span"),r(44),x(45,"date"),i()(),n(46,"div",18)(47,"span",19),r(48,"ID Blockchain:"),i(),n(49,"span"),r(50),i()()()(),n(51,"p-card",23)(52,"pre",24),r(53),x(54,"json"),i()(),u(55,Me,2,0,"div",25),i()),t&2){let e=m();o(7),d(e.cert.holderName),o(5),d(e.cert.holderDocument),o(5),d(e.cert.holderEmail||"N/A"),o(6),h("",e.cert.currency," ",k(24,13,e.cert.amount,"1.2-2"),""),o(6),d(e.cert.currency),o(5),d(e.cert.description||"N/A"),o(5),l("value",e.cert.status)("severity",e.cert.status==="issued"?"success":"danger"),o(5),d(k(45,16,e.cert.createdAt,"dd/MM/yyyy HH:mm")),o(6),d(e.cert.blockchainCertificateId),o(3),d(z(54,19,e.cert.metadata)),o(2),l("ngIf",e.cert.status==="issued"&&e.isOfficer)}}var at=(()=>{class t{route;certService;auth;cert=null;loading=!0;constructor(e,s,a){this.route=e,this.certService=s,this.auth=a}get isOfficer(){return this.auth.hasRole("admin","officer")}ngOnInit(){let e=this.route.snapshot.paramMap.get("id");e&&this.certService.getOne(e).subscribe({next:s=>{this.cert=s,this.loading=!1},error:()=>this.loading=!1})}revoke(){confirm("Revocar este certificado?")&&this.certService.revoke(this.cert.id).subscribe({next:()=>{this.cert.status="revoked"}})}static \u0275fac=function(s){return new(s||t)(v(W),v(pe),v(te))};static \u0275cmp=b({type:t,selectors:[["app-certificate-detail"]],decls:24,vars:2,consts:[[1,"layout"],[1,"sidebar"],[1,"sidebar-header"],[1,"pi","pi-shield"],[1,"nav-menu"],["routerLink","/dashboard"],[1,"pi","pi-home"],["routerLink","/certificates",1,"active"],[1,"pi","pi-file"],[1,"sidebar-footer"],[1,"content"],["label","Volver","icon","pi pi-arrow-left","routerLink","/certificates",1,"p-button-text","mb-3"],["style","text-align:center;padding:3rem",4,"ngIf"],[4,"ngIf"],[2,"text-align","center","padding","3rem"],["mode","indeterminate"],[1,"info-grid"],["header","Informacion del Titular"],[1,"info-row"],[1,"label"],["header","Informacion Financiera"],["header","Estado"],[3,"value","severity"],["header","Metadata","styleClass","mt-3"],[1,"json-block"],["class","actions",4,"ngIf"],[1,"actions"],["label","Revocar Certificado","icon","pi pi-ban","severity","danger",3,"onClick"]],template:function(s,a){s&1&&(n(0,"div",0)(1,"nav",1)(2,"div",2),p(3,"i",3),n(4,"span"),r(5,"CreditCerts"),i()(),n(6,"ul",4)(7,"li")(8,"a",5),p(9,"i",6),r(10," Dashboard"),i()(),n(11,"li")(12,"a",7),p(13,"i",8),r(14," Certificados"),i()()(),n(15,"div",9)(16,"small"),r(17,"Detalle del Certificado"),i()()(),n(18,"main",10),p(19,"p-button",11),n(20,"h2"),r(21,"Detalle del Certificado"),i(),u(22,Se,2,0,"div",12)(23,Ie,56,21,"div",13),i()()),s&2&&(o(22),l("ngIf",a.loading),o(),l("ngIf",a.cert))},dependencies:[S,_,K,U,G,X,oe,ae,re,ne,le,se,ce],styles:[".layout[_ngcontent-%COMP%]{display:flex;min-height:100vh}.sidebar[_ngcontent-%COMP%]{width:240px;background:#1e3c72;color:#fff;display:flex;flex-direction:column;position:fixed;height:100vh}.sidebar-header[_ngcontent-%COMP%]{padding:1.25rem;display:flex;align-items:center;gap:.75rem;font-size:1.2rem;font-weight:700;border-bottom:1px solid rgba(255,255,255,.1)}.sidebar-header[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]{font-size:1.5rem}.nav-menu[_ngcontent-%COMP%]{list-style:none;padding:1rem 0;margin:0}.nav-menu[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{display:flex;align-items:center;gap:.75rem;padding:.75rem 1.25rem;color:#fffc;text-decoration:none;transition:all .2s}.nav-menu[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover, .nav-menu[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]   a.active[_ngcontent-%COMP%]{background:#ffffff1a;color:#fff}.sidebar-footer[_ngcontent-%COMP%]{padding:1rem;border-top:1px solid rgba(255,255,255,.1)}.content[_ngcontent-%COMP%]{margin-left:240px;padding:2rem;flex:1}.info-grid[_ngcontent-%COMP%]{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:1.5rem}.info-row[_ngcontent-%COMP%]{display:flex;justify-content:space-between;padding:.5rem 0;border-bottom:1px solid #f0f0f0}.label[_ngcontent-%COMP%]{font-weight:600;color:#555}.mt-3[_ngcontent-%COMP%]{margin-top:1.5rem}.mb-3[_ngcontent-%COMP%]{margin-bottom:1rem}.json-block[_ngcontent-%COMP%]{background:#f8f9fa;padding:1rem;border-radius:6px;font-size:.85rem;overflow-x:auto}.actions[_ngcontent-%COMP%]{margin-top:1.5rem;text-align:right}"]})}return t})();export{at as CertificateDetailComponent};
