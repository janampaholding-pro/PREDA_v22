'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import {claveDeRuta,tieneModulo,primeraRuta} from '@/lib/permisos'
import CuentaMenu from '@/components/CuentaMenu'
const NAV=[
  {s:'PROCESOS',i:[{href:'/seleccion/dashboard',l:'Dashboard',e:'📊'},{href:'/seleccion/procesos',l:'Mis Procesos',e:'📁'},{href:'/seleccion/oferta',l:'Crear Oferta',e:'📝'}]},
  {s:'SELECCIÓN',i:[{href:'/seleccion/cv',l:'Analizar CV',e:'📄'},{href:'/seleccion/masiva',l:'Carga Masiva',e:'📦'},{href:'/seleccion/candidatos',l:'Candidatos',e:'👥'},{href:'/seleccion/entrevista',l:'Entrevista IA',e:'🎙️'},{href:'/seleccion/comparar',l:'Comparar',e:'⚖️'},{href:'/seleccion/shortlist',l:'Shortlist',e:'🏆'}]},
  {s:'GESTIÓN',i:[{href:'/seleccion/verificaciones',l:'Verificaciones',e:'🔍'},{href:'/seleccion/emails',l:'Emails RRHH',e:'✉️'},{href:'/seleccion/reportes',l:'Reportes',e:'📈'}]},
  {s:'ADMIN',i:[{href:'/administracion/config',l:'Configuracion',e:'⚙️'},{href:'/administracion/usuarios',l:'Gestion Usuarios',e:'👑'}]},
]
export default function SeleccionLayout({children}:{children:React.ReactNode}){
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
        <span style={{padding:'2px 9px',borderRadius:20,fontSize:10,fontWeight:600,background:'var(--adim)',color:'var(--accent2)'}}>SELECCIÓN DE PERSONAL</span>
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
                <button key={it.href} onClick={()=>router.push(it.href)} style={{display:'flex',alignItems:'center',gap:7,padding:'8px 9px',borderRadius:7,width:'100%',textAlign:'left',background:path===it.href?'rgba(30,123,232,.15)':'transparent',color:path===it.href?'var(--accent2)':'var(--text-2)',border:'none',borderLeft:path===it.href?'2px solid var(--accent)':'2px solid transparent',cursor:'pointer',fontFamily:'var(--font)',fontSize:12,fontWeight:path===it.href?600:400,transition:'.12s'}}>
                  <span style={{width:16,textAlign:'center',fontSize:13}}>{it.e}</span>{it.l}
                </button>
              ))}
            </div>
          ))}
          {user&&tieneModulo(user.permisos||[],'empleabilidad')&&(
          <div style={{marginTop:'auto',paddingTop:9,borderTop:'1px solid var(--border)'}}>
            <button onClick={()=>router.push(primeraRuta(user.permisos||[],'empleabilidad')||'/modulos')} style={{display:'flex',alignItems:'center',gap:7,padding:'8px 9px',borderRadius:7,width:'100%',textAlign:'left',background:'transparent',color:'var(--ok)',border:'none',cursor:'pointer',fontFamily:'var(--font)',fontSize:12}}>💼 Ir a Empleabilidad</button>
          </div>
          )}
        </div>
        <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>{children}</div>
      </div>
    </div>
  )
}
