export function getOrderedSlotsWithStartTime(day, items){
  const orderedDays = [...day].sort((a, b)=>{
    if(a.order > b.order) return 1;
    if(a.order < b.order) return -1;
    return 0;
  });
  const [daysWithStartTime] = orderedDays.reduce(([acc, prevTime], item)=>{
    acc.push({ ...item, item: items[item.itemId], startTime: prevTime});
    return [acc, prevTime + item.duration];
  }, [[], 0]);
  return daysWithStartTime;
}