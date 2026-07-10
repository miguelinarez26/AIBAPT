# REGLAS DEL PROYECTO (AIBAPT)

<RULE[supabase_typescript]>
## Prevención de Errores de TypeScript en Vercel (Supabase)
1. Al realizar consultas a Supabase en archivos `.tsx` o `.ts` que Next.js deba compilar en Vercel, **SIEMPRE** asegúrate de forzar el tipado de la respuesta si solo se extraen campos específicos (`select('campo')`), o si se hace uso del método `single()` o `maybeSingle()`.
2. Para evitar que TypeScript deduzca el tipo de las respuestas como `never` o devuelva errores de compilación (`Property 'x' does not exist on type 'never'`), castea la respuesta agregando `as any` al final de la consulta.
   
**Ejemplo Correcto:**
```typescript
const { data: profile } = (await supabase
  .from('profiles')
  .select('is_member')
  .eq('id', user.id)
  .single()) as any; // <- CRÍTICO PARA VERCEL
```
</RULE[supabase_typescript]>
