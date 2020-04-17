const Concentrate = require('concentrate')

module.exports = {
  glowStruct: Concentrate()
                          .uint32()   // buffer 4 BYTE

                          .floatle(0) // r
                          .floatle(0xffffffff) // g
                          .floatle(0) // b
                          .floatle(0xffffffff) // a

                          // .doublele(0)  // buffer 8 BYTE
                          // .doublele(0)  // buffer 8 BYTE

                          .uint8(0x00)  // buffer 1 BYTE
                          .uint8(0x00)  // buffer 1 BYTE
                          .uint8(0x00)  // buffer 1 BYTE
                          .uint8(0x00)  // buffer 1 BYTE
                          .uint8(0x00)  // buffer 1 BYTE
                          .uint8(0x00)  // buffer 1 BYTE
                          .uint8(0xf8)  // buffer 1 BYTE
                          .uint8(0xf7)  // buffer 1 BYTE

                          .uint8(0x00)  // buffer 1 BYTE
                          .uint8(0x00)  // buffer 1 BYTE
                          .uint8(0x00)  // buffer 1 BYTE
                          .uint8(0x00)  // buffer 1 BYTE
                          .uint8(0x9a)  // buffer 1 BYTE
                          .uint8(0x99)  // buffer 1 BYTE
                          .uint8(0x99)  // buffer 1 BYTE
                          .uint8(0x3e)  // buffer 1 BYTE

                          .uint8(1)  // renderWhenOccluded
                          .uint8(1)  // renderWhenUnoccluded
                          .uint8(1)  // fullBloom

                          .uint32()   // buffer 4 BYTE
                          .uint8()      // buffer 1 BYTE

                          .int32(1)    // glowStyle

                          .result(),

  clrRenderTeam: rgba => Concentrate()
                              .uint8(rgba.r)   // r
                              .uint8(rgba.g)   // g
                              .uint8(rgba.b)   // b

                              .result(),

  clrRenderEnemy: rgba => Concentrate()
                              .uint8(rgba.r)   // r
                              .uint8(rgba.g)   // g
                              .uint8(rgba.b)   // b

                              .result(),
}