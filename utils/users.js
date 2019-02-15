const bcrypt = require('bcrypt');

const crypPassword = (password) => {
  bcrypt.hash(password, 2)
    .then((pw) => {
      console.log(password, pw);
    });
};
/*
crypPassword('T0m1sCool');
crypPassword('J1immyz2');
crypPassword('Petaaaz');

Different ones generated every time
Petaaaz $2b$04$tznr4IppXieCd8u3DFonI.r8vvp1o5DSPhWE35vGWslIwfafnR.dG
T0m1sCool $2b$04$DnU9PTUqLn7ruW9nJhSYA.ZkWzge7hy7Rx2Ws6JdjtneVmDWhEpzy
J1immyz2 $2b$04$oDKM555suWRvRDv10u6ZKOkNmeLsvEHW8Fdvgd1bUZn1ru5wHwboC

Petaaaz $2b$04$vdpsZQVnwRdqFExoK8QL5uHlBnm6S.n99bnHmmrUUj80xA0NLi1iC
J1immyz2 $2b$04$lPh83wWWyjWyvi01xgd3P.Lz2H4RUC7yxkYBGqdWH1tmS5586TgsS
T0m1sCool $2b$04$CZZpuNS8fIJfK.YCs20cLOTACqDSSWNTYt.ROBMXnvISmpkGPaWfm

J1immyz2 $2b$04$DZbFi7VbR2XumUd5lqCT6.WnvKdjQZB6AU5eznfnfUZkLbHzDVWqO
T0m1sCool $2b$04$g8MBhTeNETPWRxdR8WE2k.y6D038CsRylRM2X3SJiluSpLNlpql0u
Petaaaz $2b$04$cZKO.Xd4zrTj3CM7Tgk.zeVr2qgqC/ePPhMpy89wogVFJcyiI95I.

but comparing will result in true:

bcrypt.compare('Petaaaz', '$2b$04$tznr4IppXieCd8u3DFonI.r8vvp1o5DSPhWE35vGWslIwfafnR.dG')
  .then((res) => {
    console.log(res);
  });
 */
