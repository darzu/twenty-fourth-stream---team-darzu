namespace SpriteKind {
    export const Plate = SpriteKind.create()
    export const CompleteLocation = SpriteKind.create()
}
namespace myTiles {
    //% blockIdentity=images._tile
    export const tile0 = img`
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
`
    //% blockIdentity=images._tile
    export const tile1 = img`
c c b b b b b b b b b b b b c c 
c c b b b b b b b b b b b b c c 
c c b b b b b b b b b b b b c c 
c c b b b b b b b b b b b b c c 
c c b b b b b b b b b b b b c c 
c c b b b b b b b b b b b b c c 
c c b b b b b b b b b b b b c c 
c c b b b b b b b b b b b b c c 
c c b b b b b b b b b b b b c c 
c c b b b b b b b b b b b b c c 
c c b b b b b b b b b b b b c c 
c c b b b b b b b b b b b b c c 
c c b b b b b b b b b b b b c c 
c c c c c c c c c c c c c c c c 
c c c c c c c c c c c c c c c c 
c c c c c c c c c c c c c c c c 
`
}
function mkIngrediant (col: number, row: number, idx: number) {
    ingr_inst_pic = ingrediants[idx]
    ingr_inst = sprites.create(ingr_inst_pic, SpriteKind.Food)
    sprites.setDataNumber(ingr_inst, "idx", idx)
    tiles.placeOnTile(ingr_inst, tiles.getTileLocation(col, row))
    ingr_inst.setFlag(SpriteFlag.Ghost, true)
}
function completeOrder () {
    for (let value of held_ingriants) {
        value.follow(comleteLoc)
        value.lifespan = 500
    }
    held_ingriants = []
}
sprites.onDestroyed(SpriteKind.Food, function (sprite) {
    info.changeScoreBy(1)
})
scene.onHitWall(SpriteKind.Player, function (sprite) {
    left = tilemap.locationInDirection(tilemap.locationOfSprite(sprite), CollisionDirection.Left)
    right = tilemap.locationInDirection(tilemap.locationOfSprite(sprite), CollisionDirection.Right)
    loc = tiles.getTileLocation(0, 0)
    if (tilemap.tileIs(left, sprites.dungeon.stairLadder)) {
        loc = left
        chef.x += 5
    } else if (tilemap.tileIs(right, sprites.dungeon.stairLadder)) {
        loc = right
        chef.x += -5
    }
    for (let value of sprites.allOfKind(SpriteKind.Food)) {
        if (tilemap.locationXY(loc, tilemap.XY.column) == tilemap.locationXY(tilemap.locationOfSprite(value), tilemap.XY.column) && tilemap.locationXY(loc, tilemap.XY.row) == tilemap.locationXY(tilemap.locationOfSprite(value), tilemap.XY.row)) {
            bumpIngrediant(value)
            mkIngrediant(tilemap.locationXY(loc, tilemap.XY.column), tilemap.locationXY(loc, tilemap.XY.row), sprites.readDataNumber(value, "idx"))
        }
    }
    if (tilemap.tileIs(tilemap.locationInDirection(tilemap.locationOfSprite(sprite), CollisionDirection.Top), myTiles.tile1)) {
        completeOrder()
    }
})
function mkPlate (col: number, row: number) {
    plate_inst = sprites.create(plate, SpriteKind.Plate)
    tiles.placeOnTile(plate_inst, tiles.getTileLocation(col, row))
}
function bumpIngrediant (ing: Sprite) {
    alreadyHas = false
    for (let value of held_ingriants) {
        item = ing
        if (sprites.readDataNumber(value, "idx") == sprites.readDataNumber(item, "idx")) {
            alreadyHas = true
        }
    }
    if (!(alreadyHas)) {
        held_ingriants.push(ing)
        ing.follow(chef)
        ing.z = held_ingriants.length
    }
}
let item: Sprite = null
let alreadyHas = false
let plate_inst: Sprite = null
let loc: tiles.Location = null
let right: tiles.Location = null
let left: tiles.Location = null
let ingr_inst: Sprite = null
let ingr_inst_pic: Image = null
let comleteLoc: Sprite = null
let held_ingriants: Sprite[] = []
let plate: Image = null
let ingrediants: Image[] = []
let chef: Sprite = null
tiles.setTilemap(tiles.createTilemap(
            hex`0a000800030109010607140109020813131313131313130a0810131313131313100a0c10131313131313100b0810131313131313100a0c10131313131313100a0810131313131313100a040d0e0d0d0d0d0d0d05`,
            img`
2 2 2 2 2 2 2 2 2 2 
2 . . . . . . . . 2 
2 2 . . . . . . 2 2 
2 2 . . . . . . 2 2 
2 2 . . . . . . 2 2 
2 2 . . . . . . 2 2 
2 2 . . . . . . 2 2 
2 2 2 2 2 2 2 2 2 2 
`,
            [myTiles.tile0,sprites.dungeon.purpleOuterNorth0,sprites.dungeon.purpleOuterNorthEast,sprites.dungeon.purpleOuterNorthWest,sprites.dungeon.purpleOuterSouthEast,sprites.dungeon.purpleOuterSouthWest,sprites.dungeon.purpleOuterNorth2,sprites.dungeon.purpleSwitchDown,sprites.dungeon.purpleOuterWest0,sprites.dungeon.purpleOuterNorth1,sprites.dungeon.purpleOuterEast0,sprites.dungeon.purpleOuterEast1,sprites.dungeon.purpleOuterWest1,sprites.dungeon.purpleOuterSouth1,sprites.dungeon.purpleOuterSouth0,sprites.dungeon.stairLarge,sprites.dungeon.stairLadder,sprites.dungeon.stairEast,sprites.dungeon.stairWest,sprites.dungeon.floorDark0,myTiles.tile1],
            TileScale.Sixteen
        ))
chef = sprites.create(img`
. . . . . . . . 1 1 1 1 . . . . 
. . . . 1 1 1 1 1 1 1 1 . . . . 
. . . . 1 1 1 1 1 1 1 1 . . . . 
. . . . 1 1 1 1 1 1 1 . . . . . 
. . . . 1 1 1 1 1 1 . . . . . . 
. . . . . 1 1 1 1 1 . . . . . . 
. . . . . 1 1 1 1 1 . . . . . . 
. . . . 1 1 1 1 1 1 1 . . . . . 
. . . . 1 1 1 1 1 1 1 . . . . . 
. . . c 6 7 7 7 7 6 c . . . . . 
. . c 7 7 7 7 7 7 7 7 c . . . . 
. c 6 7 7 7 7 7 7 7 7 6 c . . . 
. c 7 c 6 6 6 6 c 7 7 7 c . . . 
. f 7 6 f 6 6 f 6 7 7 7 f . . . 
. f 7 7 7 7 7 7 7 7 7 7 f . . . 
. . f 7 7 7 7 6 c 7 7 6 f c . . 
. . . f c c c c 7 7 6 f 7 7 c . 
. . c 7 2 7 7 7 6 c f 7 7 7 7 c 
. c 7 7 2 7 7 c f c 6 7 7 6 c c 
c 1 1 1 1 7 6 f c c 6 6 6 c . . 
f 1 1 1 1 1 6 6 c 6 6 6 6 f . . 
f 6 1 1 1 1 1 6 6 6 6 6 c f . . 
. f 6 1 1 1 1 1 1 6 6 6 f . . . 
. . c c c c c c c c c f . . . . 
`, SpriteKind.Player)
controller.moveSprite(chef)
ingrediants = [img`
. . . . e e e e e e e . . . . . 
. . . e e e e e e e e e . . . . 
. . e e e 2 e e e e e e e . . . 
. e e e e e e e e e e e e e . . 
. c e e e e e e e e e e e e . . 
. c e e e e e e e e e e 2 e . . 
. e e e e e e e e e e e e e . . 
. . c e e e e e e 2 e e e . . . 
. . . c e e e e e e e e . . . . 
. . . . e c e e e e e . . . . . 
`, img`
. . . . . 7 6 7 7 7 7 7 7 . . . 
. . . . 6 6 6 7 7 7 7 6 6 7 7 . 
. . . 7 6 7 7 7 7 7 7 6 7 7 7 . 
. . 7 6 6 7 7 7 7 6 6 7 7 7 7 7 
. 7 6 7 7 7 7 7 6 7 7 7 7 7 7 7 
7 6 7 7 7 7 7 6 7 7 7 7 7 7 7 7 
. 7 7 7 7 7 7 6 7 7 7 7 7 7 7 7 
. . . . . . 7 7 7 7 7 7 7 7 . . 
. . . . . . 7 7 7 7 7 7 6 6 . . 
. . . . . . . 7 7 6 6 6 6 . . . 
`, img`
. . . . . . . . 7 7 7 . . . . . 
. . . 2 2 2 2 2 2 7 2 2 . . . . 
. . 2 2 4 4 4 2 4 4 4 2 2 . . . 
2 2 4 4 4 4 4 2 4 4 4 4 2 2 2 2 
2 4 4 4 4 4 2 4 4 4 4 4 4 4 2 2 
2 4 4 4 4 2 2 4 4 4 4 4 4 4 4 2 
2 4 4 4 4 2 4 4 4 4 4 4 4 4 2 . 
2 4 4 4 2 4 4 4 4 4 4 4 4 2 . . 
2 2 2 2 2 4 4 4 4 4 4 4 2 2 . . 
. . . 2 2 2 2 2 2 2 2 2 . . . . 
`, img`
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . 5 5 5 5 . . . . . 
. . . . 5 5 5 5 5 5 5 5 5 5 . . 
. . 5 5 . . 5 5 5 5 5 5 5 5 . . 
. . 5 5 5 5 5 5 5 5 . . 5 5 . . 
. . . . . 5 5 5 5 5 5 5 . . . . 
`, img`
. . . . . . . . . . . . . . . . 
. . . . . 1 1 1 1 1 1 1 . . . . 
. . 1 1 1 d d d 1 d d d 1 1 . . 
. 1 1 d d d 1 1 1 1 d d d 1 1 . 
. 1 d d d 1 1 d 1 1 1 d 1 d 1 1 
. 1 d 1 d 1 1 d d 1 d d d d 1 1 
. 1 d d 1 d 1 1 1 d d d d 1 . . 
. 1 1 d d d d d d d 1 d 1 1 . . 
. . 1 1 d 1 d d d d 1 1 1 . . . 
. . . 1 1 1 1 1 1 1 1 . . . . . 
`, img`
. . . . . . . . . . . . . . . . 
. . . . . . . . . . 5 . . . 5 . 
. . . . 4 4 4 4 . . 5 . . . 5 . 
. . . 4 4 5 5 5 5 5 5 5 5 5 5 . 
. . 4 4 5 d d d d d 4 4 4 5 5 . 
. . 4 5 . . 4 4 5 5 5 5 4 . 5 . 
. 4 5 . . 4 5 . d d . 5 4 d 5 . 
. . 5 . d 4 5 e 2 2 2 5 4 d 5 . 
. . 5 . d 5 . 2 2 2 2 5 4 d 5 . 
. 5 5 . d 5 4 4 2 f f 4 4 d 5 . 
. 5 5 . 4 5 . 4 4 4 . d d d 5 . 
5 5 5 . 4 5 5 . . d d d . 5 . . 
5 . . 5 4 4 . 5 5 5 5 5 5 . . . 
. 5 . 5 5 4 4 4 4 4 . 5 5 . . . 
. 5 . . 5 5 . . . . . . 5 5 . . 
. . . . . . . . . . . . . . . . 
`, img`
. . . . c c c b b b b b . . . . 
. . c c b 4 4 4 4 4 4 b b b . . 
. c c 4 4 4 4 4 4 4 4 4 4 b c . 
. e 4 4 4 4 4 4 4 4 4 4 4 4 e . 
e b 4 4 4 4 4 4 4 4 4 4 4 4 b c 
e b 4 4 4 4 4 4 4 4 4 4 4 4 4 e 
e b b 4 4 4 4 4 4 4 4 4 4 4 b e 
. e b 4 4 4 4 4 4 4 4 4 4 b e . 
. . e e b 4 4 4 4 4 4 b e e . . 
. . . e e e e e e e e e e . . . 
`, img`
. . . . c c c b b b b b . . . . 
. . c c b 4 4 4 4 4 4 b b b . . 
. c c 4 4 4 4 4 5 4 4 4 4 b c . 
. e 4 4 4 4 4 4 4 4 4 5 4 4 e . 
e b 4 5 4 4 5 4 4 4 4 4 4 4 b c 
e b 4 4 4 4 4 4 4 4 4 4 5 4 4 e 
e b b 4 4 4 4 4 4 4 4 4 4 4 b e 
. e b 4 4 4 4 4 5 4 4 4 4 b e . 
. . e e b 4 4 4 4 4 4 b e e . . 
. . . e e e e e e e e e e . . . 
`]
plate = img`
. . . . . . . . . . . . . . . . 
. . . . . 1 1 1 1 1 1 1 . . . . 
. . . 1 1 1 1 1 1 1 1 1 1 1 . . 
. . 1 1 1 1 1 1 1 1 1 1 1 1 1 . 
. . 1 1 1 1 1 1 1 1 1 1 1 1 1 . 
. 1 1 1 1 1 1 1 1 1 1 1 1 1 1 f 
. 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
. 1 1 1 1 1 1 1 1 1 1 1 1 1 1 f 
. 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
. 1 1 1 1 1 1 1 1 1 1 1 1 1 1 f 
. 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
. 1 1 1 1 1 1 1 1 1 1 1 1 1 1 f 
. . 1 1 1 1 1 1 1 1 1 1 1 1 1 f 
. . 1 1 1 1 1 1 1 1 1 1 1 1 1 . 
. . . 1 1 1 1 1 1 1 1 1 1 1 f . 
. . . . . 1 f 1 f 1 f 1 . . . . 
`
held_ingriants = []
mkPlate(1, 2)
for (let index = 0; index <= 3; index++) {
    mkIngrediant(1, 3 + index, index)
    mkIngrediant(8, 3 + index, 4 + index)
}
comleteLoc = sprites.create(img`
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
`, SpriteKind.CompleteLocation)
comleteLoc.setPosition(100, 1)
