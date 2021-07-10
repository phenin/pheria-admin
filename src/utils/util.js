import { sumBy, find } from 'lodash';

export const getCookie = (name) => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
}

export const setCookie = (cname, cvalue, exdays) => {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    const expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

export function getInfoUser() {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return undefined;
    }
  }


export const generateDensityRange = (max) => {
    // const number = 11
    const number = 9
    if (max > number) {
        let range = []

        const step = Math.floor(max / number)

        for (let i = 0; i < number; i++) {
            range.push(step * i)
        }

        return range
    }
    else {
        // return [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
        return [ 0, 1, 2, 3, 4, 5, 6, 7, 8]
    }
}

// const findTravelTimeRecord = (feature) => (r) => {
//     if (r && r.key) {
//         const expression = `^(\\d+)-(\\d+)_(\\d+)-${feature.properties.wardID}(.*)$`
//         const regex = new RegExp(expression)
//
//         return regex.test(r.key)
//     }
//     else return false
// }

export function mapTravelTimeData(data, geojson, excludedDistricts, mapDataByField = "lead_time") {
    if (data && geojson) {
        const totalOrders = sumBy(data, 'orders');

        let maxValue = 0

        let features = []
        geojson.features.forEach(feature => {
            if (
                !feature.properties.isDistrict
                && (!excludedDistricts
                    || (excludedDistricts && !excludedDistricts.includes(feature.properties.districtID)))
            ) {
                let orders, lead_time = 0
                let _feature = {...feature}
                _feature.properties.percentage = 0
                _feature.properties.orders = 0
                _feature.properties.lead_time = 0

                const polygonRecord = find(data, r => r.to_ward_id === feature.properties.wardID)
                // const polygonRecord = find(data, findTravelTimeRecord(feature))

                if (polygonRecord) {
                    orders = polygonRecord.orders
                    lead_time = polygonRecord.lead_time
                    _feature.properties.orders = orders
                    _feature.properties.lead_time = lead_time

                    if (totalOrders && totalOrders !== 0) {
                        _feature.properties.percentage = (orders / totalOrders * 100).toFixed(1)
                    }
                }
                // else
                // TODO check ward no data. update orders, lead_time

                features.push(_feature)

                if (_feature.properties[mapDataByField] > maxValue) {
                    maxValue = _feature.properties[mapDataByField]
                }
            }
        })

        return {
            features,
            maxValue
        }
    }
    else {
        return {}
    }
}

export function toNumberLocaleString(number) {
  if(number) {
    // round 1000
    const _number = number / 1000

    // TODO: remove hardcode Suffix
    if (Number.isInteger(_number)) return `${_number}K+`
    else {
      if (_number < 0.1) return `${number}+`
      else return `${_number.toFixed(1)}K+`
    }
  }
  else return number
}

export function getDay(number, isFullFormat = false) {
    number = parseInt(number)

    switch(number) {
        case 0:
            return isFullFormat ? 'Sunday' : 'Su'
        case 1:
            return isFullFormat ? 'Monday' : 'Mo'
        case 2:
            return isFullFormat ? 'Tuesday' : 'Tu'
        case 3:
            return isFullFormat ? 'Wednesday' : 'We'
        case 4:
            return isFullFormat ? 'Thursday' : 'Th'
        case 5:
            return isFullFormat ? 'Friday' : 'Fr'
        case 6:
            return isFullFormat ? 'Saturday' : 'Sa'
        default:
            return ''
    }
}

export function getMinutes(seconds) {
    return `${Math.floor(seconds / 60)}min`
}

export function getTime(seconds) {
    let str = Math.floor(seconds / 60)
    const r = Math.floor(seconds % 60)

    if (r !== 0) {
        return `${str}min ${Math.abs(r)}sec`
    }
    else return str
}

export const getFloat = (p, fixed = 2) => `${p && Number(p).toFixed(fixed)}`
export const getPercent = (p, fixed = 2) => `${p && Number(p * 100).toFixed(fixed)}%`
export const getDistance = (p) => `${p && Number(p).toFixed(1)}km`
export const getMoney = (p) => `${p && Number(p).toLocaleString('vi', {'style' : 'currency', 'currency' : 'VND'})}`

// https://github.com/Leaflet/Leaflet/issues/1196#issue-8965774
// https://en.wikipedia.org/wiki/Centroid#Centroid_of_polygon
// accurate in polygon > 5x5meters
export function getCenterOfPolygon(latlngs) {
    var pts = latlngs;

    var twicearea = 0;
    var p1, p2, f;
    var x = 0, y = 0;
    var nPts = pts.length;

    for(var i = 0, j = nPts-1; i < nPts; j = i++) {
        p1=pts[i];
        p2=pts[j];
        twicearea += p1[1] * p2[0];
        twicearea -= p1[0] * p2[1];

        f = p1[1] * p2[0] - p2[1] * p1[0];

        x += (p1[1] + p2[1]) * f;
        y += (p1[0] + p2[0]) * f;
    }

    f = twicearea * 3;

    return {lat: x/f,lng: y/f};
}


// https://github.com/maxogden/geojson-js-utils/blob/master/geojson-utils.js
// adapted from http://www.kevlindev.com/gui/math/intersection/Intersection.js
// https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection
const lineStringsIntersect = function (l1, l2) {
    var intersects = [];
    for (var i = 0; i <= l1.coordinates.length - 2; ++i) {
      for (var j = 0; j <= l2.coordinates.length - 2; ++j) {
        var a1 = {
          x: l1.coordinates[i][1],
          y: l1.coordinates[i][0]
        },
          a2 = {
            x: l1.coordinates[i + 1][1],
            y: l1.coordinates[i + 1][0]
          },
          b1 = {
            x: l2.coordinates[j][1],
            y: l2.coordinates[j][0]
          },
          b2 = {
            x: l2.coordinates[j + 1][1],
            y: l2.coordinates[j + 1][0]
          },
          ua_t = (b2.x - b1.x) * (a1.y - b1.y) - (b2.y - b1.y) * (a1.x - b1.x),
          ub_t = (a2.x - a1.x) * (a1.y - b1.y) - (a2.y - a1.y) * (a1.x - b1.x),
          u_b = (b2.y - b1.y) * (a2.x - a1.x) - (b2.x - b1.x) * (a2.y - a1.y);
        if (u_b !== 0) {
          var ua = ua_t / u_b,
            ub = ub_t / u_b;
          if (0 <= ua && ua <= 1 && 0 <= ub && ub <= 1) {
            intersects.push([a1.y + ua * (a2.y - a1.y), a1.x + ua * (a2.x - a1.x)]);
          }
        }
      }
    }
    if (intersects.length === 0) intersects = false;
    return intersects;
}

// Get intersection point of line & polygon
export const linePolygonIntersecton = (line, polygon) => {
    let intersects = lineStringsIntersect(
        {"type": "LineString", "coordinates": line},
        {"type": "LineString", "coordinates": polygon}
    )

    if (intersects && intersects.length > 0) {
        return intersects[0]
    }
    else return null
}

// Get degree of two points
// https://en.wikipedia.org/wiki/Atan2
export const getDegreeO2p = (p1, p2) => {
    let x = p2.x - p1.x
    let y = p2.y - p1.y

    return Math.atan2(y, x) * 180 / Math.PI
}

export const findRangeIndex = (n, range) => {
    let index = 0
    if (n > 0 && range && range.length > 0) {
        range.some((r, i) => {
            if ( n >= r && (range.length === (i+1) || n < range[i+1])) {
                index = i
                return true
            }
            else return false
        })
    }

    return index
}

const metersPerPixel = function(latitude, zoomLevel) {
  const earthCircumference = 40075016.686;
  const latitudeRadians = latitude * (Math.PI/180);
  return earthCircumference * Math.cos(latitudeRadians) / Math.pow(2, zoomLevel + 8);
};

export const pixelValue = function(latitude, meters, zoomLevel) {
  return meters / metersPerPixel(latitude, zoomLevel);
};

export function removeUnicode(str = "") {
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");

  return str;
}

export function minFormatMoney(value) {
    if (value === undefined || value === null || value === "") return "";
    const num = Number(value);
    return (Number.isInteger(num) ? num : num.toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }