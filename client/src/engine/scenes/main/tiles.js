const rock = 'R';
const path = ' ';
const wall = '#';

// export default function (current, [top, right, bottom, left]) {
//   switch (current) {
//     case path:
//       return 0;
//     case rock:
//       return 2;
//     case wall:
//       if (bottom === path) {
//         if (left === path && right === path) return 13;
//         else if (right === path) return 12;
//         else if (left === path) return 11;
//         return 10;
//       }
//
//       if (top === path && right === path && left === path) return 9;
//       else if (top === path && right === path) return 8;
//       else if (top === path && left === path) return 7;
//       else if (top === path) return 5;
//       else if (right === path && left === path) return 6;
//       else if (right === path) return 4;
//       else if (left === path) return 3;
//
//       return 2;
//     default:
//       return -1;
//   }
// }

// eslint-disable-next-line no-unused-vars
export default function (current, [top, right, bottom, left]) {
  switch (current) {
    case path:
      return 0;
    case rock:
      return 2;
    case wall:
      if (bottom === path) return 3;
      return 2;
    default:
      return -1;
  }
}
