import { Scene } from "phaser";
import { CONFIG } from "../config";
import HUD from "../entities/HUD";

// 9-slice = técnica de divisão de imagem
// texture packer = programa gera JSON a partir de imagens

export default class Lab2 extends Scene {

    /** @type {Phaser.Tilemaps.Tilemap} */
    map;
    layers = {};

    hud;

    spaceDown = false;



    constructor() {
        super('Lab2');
    }


    preload(){
        //Carregar os dados do mapa
        this.load.tilemapTiledJSON('tilemap-lab-info', './sala.tmj');

        // carregar os tilesets do map (as imagens)
        this.load.image('Office', './Tiles/tiles_office.png');
        this.load.image('Floors', './Tiles/tiles_floors.png');
        this.load.image('Walls', './Tiles/tiles_walls.png');
        this.load.image('Trash', './Tiles/lixeiras_spritesheet.png');

        this.load.atlas('hud', 'hud.png', 'hud.json');

    }


    create() {

        this.cursors = this.input.keyboard.createCursorKeys();

        this.createMap();
        this.createLayers();


        this.hud = new HUD(this, 0, 0);// cria o HUD e coloca na cena (this=Lab2)
        

    }


    update() {
        const { space } = this.cursors;

        if ( space.isDown && !this.spaceDown ){
            console.log("Espaco!!");
            this.spaceDown = true;
            this.hud.showDialog('Este é o texto que deve aparecer na caixa de dialogo, por favor coloque um texto grande aqui para que use varias linhas'); 
            
        } else if (!space.isDown && this.spaceDown){
            this.spaceDown = false;
        }

    }

    createMap(){
        this.map = this.make.tilemap({
            key: 'tilemap-lab-info',    // Dados JSON do mapa
            tileWidth: CONFIG.TILE_SIZE,
            tileHeight: CONFIG.TILE_SIZE
        });

        // Fazendo a correspondencia entre as imagens usadas no Tiled
        // e as carregadas pelo Phaser
        // addTilesetImage(nome da imagem no Tiled )

        this.map.addTilesetImage('tiles_office', 'Office');
        this.map.addTilesetImage('tiles_floors', 'Floors');
        this.map.addTilesetImage('tiles_walls', 'Walls');
        this.map.addTilesetImage('lixeiras_spritesheet', 'Trash');

    }

    createLayers(){
        // pegando os tilesets (usar os nomes dados no Tiled)
        const tilesOffice = this.map.getTileset('tiles_office');
        const tilesWalls = this.map.getTileset('tiles_walls');
        const tilesFloors = this.map.getTileset('tiles_floors');
        const tilesTrash = this.map.getTileset('lixeiras_spritesheet');

        const layerNames = this.map.getTileLayerNames();
        //console.log(layerNames);
        for (let i = 0; i < layerNames.length; i++) {
            const name = layerNames[i];

            //this.map.createLayer(name, [tilesOffice], 0, 0); // retirado na aula
            //this.layers[name] = this.map.createLayer(name, [tilesOffice, tilesFloors, tilesWalls], 0, 0);
            this.layers[name] = this.map.createLayer(name, [tilesOffice, tilesFloors, tilesWalls, tilesTrash], 0, 0);
           
            
            // Definindo a profundidade de cada camada
            this.layers[name].setDepth( i );
           

            // Verificando se o layer possui colisão 
            if ( name.endsWith('Collision') ){
                this.layers[name].setCollisionByProperty({ collide: true}); // Mesmo nome colocado na propriedade (custom properties)

                if ( CONFIG.DEBUG_COLLISION ) {
                    const debugGraphics = this.add.graphics().setAlpha(0.75).setDepth(i);
                    this.layers[name].renderDebug(debugGraphics, {
                        tileColor: null, // Color of non-colliding tiles
                        collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
                        faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
                    });
                }
            }
       
        }


    }

    
}