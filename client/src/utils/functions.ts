export const getHashCode = () => {
    const textList = [
      'blue',
      'red',
      'pink',
      'black',
      'purple',
      'orange',
      'grey',
      'white',
      'yellow',
    ];
    const randomFirstNumber = Math.floor(
      Math.random() * (textList.length - 1 - 0 + 1) + 0
    );
    const randomSecondNumber = Math.floor(
      Math.random() * (textList.length - 1 - 0 + 1) + 0
    );
  
    const string = textList[randomFirstNumber] + textList[randomSecondNumber];
    var hash = 0,
      i,
      chr;
    if (string.length === 0) return hash;
    for (i = 0; i < string.length; i++) {
      chr = string.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  };