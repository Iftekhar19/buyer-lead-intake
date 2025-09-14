export function computeDiff(oldData: any, newData: any) {
  const diff: Record<string, { oldValue: any; newValue: any }> = {};
 console.log("Old Data--->",oldData)
 console.log("New Data--->",newData)
  for (const key of Object.keys(newData)) {
    if(key=="tags" && oldData[key].toString()!==newData[key].toString()){

       diff[key]={
        oldValue:oldData[key],
        newValue:newData[key]
       }
    }
    else if (oldData[key] !== newData[key]) {
      diff[key] = {
        oldValue: oldData[key],
        newValue: newData[key],
      };
    }
  }
//    console.log(diff)
  return diff;
}

