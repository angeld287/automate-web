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

export const isValidUrl = (urlString: string) => {
  var urlPattern = new RegExp('^(https?:\\/\\/)?'+ // validate protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // validate domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // validate OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // validate port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // validate query string
  '(\\#[-a-z\\d_]*)?$','i'); // validate fragment locator
  return !!urlPattern.test(urlString);
}

export const isValidImageUrl = (urlString: string) => {
  return(urlString.match(/\.(jpeg|jpg|gif|png)$/) != null);
}
