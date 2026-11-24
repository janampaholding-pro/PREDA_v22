'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import {claveDeRuta,tieneModulo,primeraRuta} from '@/lib/permisos'
import CuentaMenu from '@/components/CuentaMenu'
const NAV=[
  {s:'CANDIDATO',i:[{href:'/empleabilidad/expediente',l:'Mi Expediente',e:'📋'},{href:'/empleabilidad/perfil',l:'Perfil a Buscar',e:'👤'}]},
  {s:'BÚSQUEDA',i:[{href:'/empleabilidad/ofertas',l:'Buscar Ofertas',e:'🔎'},{href:'/empleabilidad/entrevista',l:'Pre-Entrevista',e:'🎙️'},{href:'/empleabilidad/cv',l:'CV Harvard / ATS',e:'📄'},{href:'/empleabilidad/verificaciones',l:'Verificaciones',e:'🔍'}]},
  {s:'POSTULACIONES',i:[{href:'/empleabilidad/postulaciones',l:'Mis Postulaciones',e:'📨'},{href:'/empleabilidad/seguimiento',l:'Seguimiento',e:'📈'},{href:'/empleabilidad/reportes',l:'Mi Reporte',e:'📑'}]},
]
export default function EmpleabilidadLayout({children}:{children:React.ReactNode}){
  const router=useRouter();const path=usePathname();const[user,setUser]=useState<any>(null)
  useEffect(()=>{fetch('/api/auth/session').then(r=>r.json()).then(d=>{if(!d.user||!d.user.empresa_id){router.push('/');return};setUser(d.user)})},[])
  const ok=(href:string)=>{if(href.startsWith('/administracion'))return user?.rol==='admin';const k=claveDeRuta(href);return !!user&&!!k&&(user.permisos||[]).includes(k)}
  async function logout(){await fetch('/api/auth/logout',{method:'POST'});router.push('/')}
  return(
    <div style={{height:'100vh',display:'flex',flexDirection:'column',overflow:'hidden'}}>
      <div className="no-print" style={{display:'flex',alignItems:'center',gap:10,padding:'7px 18px',background:'var(--bg-panel)',borderBottom:'1px solid var(--border)',flexShrink:0}}>
        <button className="btn btn-sec" style={{fontSize:10,padding:'3px 9px'}} onClick={()=>router.push('/modulos')}>← Módulos</button>
        <div style={{width:1,height:16,background:'var(--border)'}}/>
        <div style={{fontSize:17,fontWeight:700,letterSpacing:2}}>PRE<span style={{color:'var(--accent)'}}>DA</span></div>
        <span style={{padding:'2px 9px',borderRadius:20,fontSize:10,fontWeight:600,background:'rgba(26,173,110,.15)',color:'var(--ok)'}}>EMPLEABILIDAD</span>
        <div style={{flex:1}}/>
        <span style={{fontSize:12,fontWeight:600}}>{user?.nombre}</span>
        <CuentaMenu/>
        <button className="btn btn-sec" style={{fontSize:11,padding:'4px 9px'}} onClick={logout}>Salir</button>
      </div>
      <div style={{flex:1,display:'flex',overflow:'hidden'}}>
        <div className="no-print" style={{width:200,flexShrink:0,background:'var(--bg-panel)',borderRight:'1px solid var(--border)',overflowY:'auto',padding:6}}>
          {NAV.map(sec=>({...sec,i:sec.i.filter(it=>ok(it.href))})).filter(sec=>sec.i.length>0).map(sec=>(
            <div key={sec.s}>
              <div style={{fontSize:9,letterSpacing:2,color:'var(--text-3)',padding:'9px 8px 3px',textTransform:'uppercase'}}>{sec.s}</div>
              {sec.i.map(it=>(
                <button key={it.href} onClick={()=>router.push(it.href)} style={{display:'flex',alignItems:'center',gap:7,padding:'8px 9px',borderRadius:7,width:'100%',textAlign:'left',background:path===it.href?'rgba(26,173,110,.15)':'transparent',color:path===it.href?'var(--ok)':'var(--text-2)',border:'none',borderLeft:path===it.href?'2px solid var(--ok)':'2px solid transparent',cursor:'pointer',fontFamily:'var(--font)',fontSize:12,fontWeight:path===it.href?600:400,transition:'.12s'}}>
                  <span style={{width:16,textAlign:'center',fontSize:13}}>{it.e}</span>{it.l}
                </button>
              ))}
            </div>
          ))}
          {user&&tieneModulo(user.permisos||[],'seleccion')&&<div style={{marginTop:'auto',paddingTop:9,borderTop:'1px solid var(--border)'}}>
            <button onClick={()=>router.push(primeraRuta(user.permisos||[],'seleccion')||'/modulos')} style={{display:'flex',alignItems:'center',gap:7,padding:'8px 9px',borderRadius:7,width:'100%',textAlign:'left',background:'transparent',color:'var(--accent2)',border:'none',cursor:'pointer',fontFamily:'var(--font)',fontSize:12}}>👔 Ir a Selección</button>
          </div>}
        </div>
        <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>{children}</div>
      </div>
    </div>
  )
}
