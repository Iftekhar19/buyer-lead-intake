// "use server"
export const loginAction=async(data:{email:string;password:string})=>
{
   try {
    const res=await fetch(`http://localhost:3000/api/login`,{
        method:"POST",
        body:JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
        credentials: "include", // 👈 important
    })
    const response=await res.json()
    // console.log(response)
    return {success:true,errors:null,name:response.name}
   } catch (error) {
    // console.log(error)
    return {errors:error,success:false}
   } 
}