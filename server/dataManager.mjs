export const updateDataArray = (data, counter, randomValue) => {
  const newData = [...data];
  newData.push({ name: counter, value: randomValue });
  while (newData.length > 20) {
    newData.shift();
  }
  return newData;
};
