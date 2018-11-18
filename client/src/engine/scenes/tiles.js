const spawn = '*';
const rock = 'undefined';
const path = ' ';
const wall = '#';

// chunk = [
//          #,
//   ['*', '*', '*'],
//          #,
// ];
export default (chunk) => {
  const tile = chunk[1][1];
  const top = chunk[0];
  const left = chunk[1][0];
  const right = chunk[1][2];
  const bottom = chunk[2];

  switch (tile) {
    case rock:
      return 3;
    case path:
      // if (left === wall && right === wall) return 2;
      // else return px;
      return px;
    case wall:
      if (bottom === path) {
        if (left === path && right === path) return 14;
        else if (left === path) return 12;
        else if (right === path) return 13;
        else return 11;
      } else {
        if (top === path && right === path && left === path) return 10;
        else if (top === path && right === path) return 9;
        else if (top === path && left === path) return 8;
        else if (top === path) return 6;
        else if (right === path && left === path) return 7;
        else if (right === path) return 5;
        else if (left === path) return 4;
      }
      return 3;
    default:
      break;
  }
}
