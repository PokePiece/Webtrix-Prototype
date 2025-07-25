'use client'

import * as THREE from 'three';

// Utility function
function extend(defaults, o1, o2, o3) {
    const extended = {};
    for (const prop in defaults) {
        if (Object.prototype.hasOwnProperty.call(defaults, prop)) {
            extended[prop] = defaults[prop];
        }
    }
    for (const prop in o1) {
        if (Object.prototype.hasOwnProperty.call(o1, prop)) {
            extended[prop] = o1[prop];
        }
    }
    for (const prop in o2 || {}) {
        if (Object.prototype.hasOwnProperty.call(o2, prop)) {
            extended[prop] = o2[prop];
        }
    }
    for (const prop in o3 || {}) {
        if (Object.prototype.hasOwnProperty.call(o3, prop)) {
            extended[prop] = o3[prop];
        }
    }
    return extended;
}

class ARMapzenGeography extends THREE.Object3D {
    
    constructor(opts = {}) {
        super();
        this.opts = opts;
        this.opts.layers = this.opts.layers || ['building'];

        this.names = {};
        this.kinds = {};
        this.kind_details = {};

        this.center = opts.center || {};
        this.marker = opts.marker;

        if (opts.lat) this.center.lat = opts.lat;
        if (opts.lng) this.center.lng = opts.lng;

        this._drawn = {};

        this.mapScale = 200000;
        this.TILE_ZOOM = 16;

        this.feature_styles = {};
        this.init_feature_styles(opts.styles || {});

        this.feature_meshes = [];
        this.meshes_by_layer = {};

        this.center.start_lng = this.center.lng;
        this.center.start_lat = this.center.lat;

        this._building_material = this.createBuildingMaterial();

        this.load_tiles(this.center.lat, this.center.lng);

        // Update position every second if marker is present
        setInterval(() => {
            if (!this.center.lat) return;
            if (this.marker) {
                this.center.lng = this.center.start_lng + this.marker.position.x / this.scale;
                this.center.lat = this.center.start_lat - this.marker.position.z / this.scale;
            }
            // Uncomment if tile loading on movement needed:
            // this.load_tiles(this.center.lat, this.center.lng);
        }, 1000);
    }

    createBuildingMaterial() {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 64;
        const context = canvas.getContext('2d');

        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, 32, 64);

        for (let y = 2; y < 64; y += 2) {
            for (let x = 0; x < 32; x += 2) {
                const value = Math.floor(Math.random() * 64);
                context.fillStyle = `rgb(${value},${value},${value})`;
                context.fillRect(x, y, 2, 1);
            }
        }

        const canvas2 = document.createElement('canvas');
        canvas2.width = 512;
        canvas2.height = 1024;
        const context2 = canvas2.getContext('2d');
        context2.imageSmoothingEnabled = false;
        context2.webkitImageSmoothingEnabled = false;
        context2.mozImageSmoothingEnabled = false;
        context2.drawImage(canvas, 0, 0, canvas2.width, canvas2.height);

        const texture = new THREE.Texture(canvas2);
        texture.needsUpdate = true;

        return new THREE.MeshLambertMaterial({
            map: texture,
            vertexColors: true, // instead of vertexColors: THREE.VertexColors
        });

    }

    long2tile(lon, zoom) {
        return Math.floor(((lon + 180) / 360) * Math.pow(2, zoom));
    }

    lat2tile(lat, zoom) {
        return Math.floor(
            ((1 -
                Math.log(
                    Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)
                ) /
                Math.PI) /
                2) *
            Math.pow(2, zoom)
        );
    }

    load_tile(tx, ty, zoom, callback) {
        const MAPBOX_API_KEY =
            'pk.eyJ1IjoiY291bnRhYmxlLXdlYiIsImEiOiJjamQyZG90dzAxcmxmMndtdzBuY3Ywa2ViIn0.MU-sGTVDS9aGzgdJJ3EwHA';
        const url = `https://api.mapbox.com/v4/mapbox.mapbox-terrain-v2,mapbox.mapbox-streets-v7/${zoom}/${tx}/${ty}.vector.pbf?access_token=${MAPBOX_API_KEY}`;

        fetch(url)
            .then((response) => response.blob())
            .then((blob) => {
                // You need to have a 'Bundle.vectors' function defined elsewhere
                Bundle.vectors(blob, function (tile) {
                    callback(tile, tx, ty, zoom);
                });
            });
    }

    load_tiles(lat, lng) {
        const tile_x0 = this.long2tile(lng, this.TILE_ZOOM);
        const tile_y0 = this.lat2tile(lat, this.TILE_ZOOM);
        const N = 1;
        for (let i = -N; i <= N; i++) {
            for (let j = -N; j <= N; j++) {
                const tile_x = tile_x0 + i;
                const tile_y = tile_y0 + j;
                if (!tile_x || !tile_y) continue;
                const key = `${tile_x}_${tile_y}_${this.TILE_ZOOM}`;
                if (!this._drawn[key]) {
                    this.load_tile(tile_x, tile_y, this.TILE_ZOOM, this.handle_data.bind(this));
                    this._drawn[key] = true;
                }
            }
        }
    }

    handle_data(data, x, y, z) {
        this.opts.layers.forEach((layername) => {
            if (this.feature_styles[layername]) {
                this.add_vt(data, layername, x, y, z);
            }
        });
    }

    add_vt(tile, layername, x, y, z) {
        const vector_layer = tile.layers[layername];
        if (!vector_layer) return;
        for (let i = 0; i < vector_layer.length; i++) {
            const feature = vector_layer.feature(i).toGeoJSON(x, y, z);
            this.add_feature(feature, layername);
        }
    }

    add_feature(feature, layername) {
        feature.layername = layername;

        const feature_styles = this.feature_styles;
        const layer_styles = feature_styles[layername] || {};
        const kind_styles = feature_styles[feature.properties.class] || {};
        const kind_detail_styles =
            layername === 'roads' ? {} : feature_styles[feature.properties.subclass] || {};
        const name_styles = feature_styles[feature.properties.name] || {};

        const styles = extend(layer_styles, kind_styles, kind_detail_styles, name_styles);

        this.kinds[feature.properties.class] = (this.kinds[feature.properties.class] || 0) + 1;
        this.names[feature.properties.name] = (this.names[feature.properties.name] || 0) + 1;
        this.kind_details[feature.properties.subclass] =
            (this.kind_details[feature.properties.subclass] || 0) + 1;

        const geometry = this.extrude_feature_shape(feature, styles);
        if (!geometry) {
            console.warn('no geometry for feature');
            return;
        }

        const opacity = styles.opacity || 1;
        let material;

        if (styles.material === 'building') {
            material = this._building_material;
        } else if (styles.shader_material) {
            material = styles.shader_material;
        } else {
            material = ARMapzenGeography._get_material_cached(styles.color, opacity);
        }

        const mesh = new THREE.Mesh(geometry, material);

        mesh.position.y = styles.offy || 0;

        // scene must be provided by user: store reference and add mesh to it
        if (this.scene) {
            this.scene.add(mesh);
        }

        mesh.feature = feature;

        this.feature_meshes.push(mesh);
        this.meshes_by_layer[layername] = this.meshes_by_layer[layername] || [];
        this.meshes_by_layer[layername].push(mesh);
    }

    extrude_feature_shape(feature, styles) {
        const shape = new THREE.Shape();

        // Buffer linestrings if needed
        if (
            feature.geometry.type === 'LineString' ||
            feature.geometry.type === 'Point' ||
            feature.geometry.type === 'MultiLineString'
        ) {
            const width = styles.width || 1;
            // Assume Bundle.turf_buffer is defined globally
            const buf = Bundle.turf_buffer(feature, width, { units: 'meters' });
            feature.geometry = buf.geometry;
        }

        const coords =
            feature.geometry.type === 'MultiPolygon'
                ? feature.geometry.coordinates[0][0]
                : feature.geometry.coordinates[0];

        let point = this.ll_to_scene_coords(coords[0]);
        shape.moveTo(point[0], point[1]);

        for (let i = 1; i < coords.length; i++) {
            point = this.ll_to_scene_coords(coords[i]);
            shape.lineTo(point[0], point[1]);
        }
        point = this.ll_to_scene_coords(coords[0]);
        shape.lineTo(point[0], point[1]);

        let height;
        if (styles.height === 'a') {
            if (feature.properties.height) {
                height = feature.properties.height;
            } else if (feature.properties.render_height) {
                height = feature.properties.render_height;
            } else if (feature.properties.area) {
                height = Math.sqrt(feature.properties.area);
            } else {
                console.warn('just a label.', feature.properties);
                return null;
            }
            height *= styles.height_scale || 1;
        } else {
            height = styles.height || 1;
        }

        let geometry;
        if (styles.extrude === 'flat') {
            geometry = new THREE.ShapeGeometry(shape);
        } else if (styles.extrude === 'rounded') {
            const extrudeSettings = {
                steps: 1,
                amount: height || 1,
                bevelEnabled: true,
                bevelThickness: 8,
                bevelSize: 16,
                bevelSegments: 16,
            };
            geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        } else {
            const extrudeSettings = {
                steps: 1,
                amount: height || 1,
                bevelEnabled: false,
            };
            geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        }

        geometry.rotateX(-Math.PI / 2);
        return geometry;
    }

    ll_to_scene_coords(coord) {
        return [
            (coord[0] - this.center.start_lng) * this.scale,
            (coord[1] - this.center.start_lat) * this.scale,
        ];
    }

    init_feature_styles(styles) {
        for (const k in DEFAULT_FEATURE_STYLES) {
            this.feature_styles[k] = DEFAULT_FEATURE_STYLES[k];
        }
        for (const k in styles) {
            this.feature_styles[k] = extend(this.feature_styles[k] || {}, styles[k]);
        }
        for (const kind in this.feature_styles) {
            if (
                this.feature_styles[kind].fragment_shader ||
                this.feature_styles[kind].vertex_shader
            ) {
                this.feature_styles[kind].shader_material = this.setup_shader(
                    this.feature_styles[kind]
                );
            }
        }
    }

    setup_shader(opts) {
        return new THREE.ShaderMaterial({
            transparent: true,
            uniforms: shader_uniforms,
            vertexShader:
                opts.vertex_shader ||
                `
          uniform float time;
          varying vec3 worldPos;
          void main() {
            vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
            worldPos = position;
            ${opts.vs_part || ''}
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
            fragmentShader:
                opts.fragment_shader ||
                `
          uniform vec2 resolution;
          uniform float time;
          varying vec3 worldPos;
          void main(void) {
            float opacity = 1.0;
            vec3 color = vec3(1.0,1.0,1.0);
            ${opts.fs_part || ''}
            gl_FragColor=vec4(color,opacity);
          }
        `,
        });
    }

    // static cached materials for performance
    static _mtl_cache = {};

    static _get_material_cached(color, opacity) {
        const key = color + '|' + opacity;
        if (!ARMapzenGeography._mtl_cache[key]) {
            ARMapzenGeography._mtl_cache[key] = new THREE.MeshLambertMaterial({
                color: color || 0xffffff,
                opacity: opacity,
                transparent: opacity < 1,
                // shading: THREE.SmoothShading, // REMOVE this line
            });

        }
        return ARMapzenGeography._mtl_cache[key];
    }
}

// Dummy placeholder for missing global vars to avoid ReferenceError.
// Replace these with your actual implementations.
const DEFAULT_FEATURE_STYLES = {}; // Provide your default styles here
const shader_uniforms = {}; // Provide your shader uniforms here
const Bundle = {
    vectors: function () {
        // Implement vector loading here
    },
    turf_buffer: function () {
        // Implement turf buffer here
    },
};

export { ARMapzenGeography };
