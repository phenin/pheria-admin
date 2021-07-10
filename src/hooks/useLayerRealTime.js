import { useState, useLayoutEffect } from 'react'
import {json as requestJson} from 'd3-fetch';
import { sortBy } from 'lodash';
import { mapPointToPolygon } from '../utils/mapPointsToPolygon';
import { EXCLUDED_DISTRICT } from '../constant'

const NUMBERS_OF_MOST_ACTIVE_POINT = 20
const ACTIVE_POINT_NUMBER_ORDERS = 30

let intervalRequest = null
let isLoadingData = false
let intervalRequestIndex = 0

let intervalRequestSuppliers = null
let isLoadingDataSuppliers = false
let intervalRequestSuppliersIndex = 0

let dataOrders_global = []
let totalSuppliers_global = 0
let totalOrders_global = 0
let dataSuppliers_global = []
let wardsGeojson_global = {}

let dataSources = {}
function setDataSources(data) {
    dataSources = data
}

function getService(services, city) {
    let s = ''
    if (services && city) {
        s = services.split(',').map(i => `${city}-${i}`).join()
    }

    return s
}

function useLayer(index, layers, token, partner, service) {
    // const [dataSources, setDataSources] = useState({});
    const [layer, setLayer] = useState(layers[index].id);
    const [city, setCity] = useState(layers[index].city);
    const [groupBy, setGroupBy] = useState(layers[index].groupBy);
    const [showComplete, setShowComplete] = useState(false);
    const [advancedConfig, setAdvancedConfig] = useState(false);
    const [isTokenExprire, setTokenExpire] = useState(false);

    const now = new Date()
    const [timeFilter, setTimeFilter] = useState({
        fromTime: new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime(),
        toTime: ''
    })

    const [layerInfo, setLayerInfo] = useState({
        ...layers[index],
        showComplete,
        advancedConfig,
        ...timeFilter
    });

    function getDataInterval(endpoint, params) {
        if (!endpoint || !params) return

        clearRequestData()

        if (endpoint.orders) {
            intervalRequestIndex++
            intervalRequest = window.setInterval(function() {
                if (!isLoadingData) {
                    isLoadingData = true
                    const currentRequestIndex = intervalRequestIndex

                    getRealTimeData(endpoint.orders, params)
                        .then(data => {
                            if (currentRequestIndex === intervalRequestIndex) {
                                let payload = {
                                    dataOrders: data.orders,
                                    totalSuppliers: data.total_suppliers,
                                    totalOrders: data.total_orders
                                }
                                if (endpoint.wardsGeojson) {
                                    payload.wardsGeojson = endpoint.wardsGeojson(params.city_id)
                                }
                                setLayerData(payload)
                            }
                            isLoadingData = false
                        })
                        .catch(() => {
                            isLoadingData = false
                        })
                }
            }, 10 * 1000)
        }

        if (endpoint.suppliers) {
            intervalRequestSuppliersIndex++
            intervalRequestSuppliers = window.setInterval(function() {
                if (!isLoadingDataSuppliers) {
                    isLoadingDataSuppliers = true
                    const currentRequestIndex = intervalRequestSuppliersIndex

                    getRealTimeData(endpoint.suppliers, params)
                        .then(data => {
                            if (currentRequestIndex === intervalRequestSuppliersIndex) {
                                setLayerData({dataSuppliers: data})
                            }
                            isLoadingDataSuppliers = false
                        })
                        .catch(() => {
                            isLoadingDataSuppliers = false
                        })
                }
            }, 8 * 60 * 1000)
        }
    }

    function getRealTimeData(endpoint, params) {
        if (!endpoint || !params) return

        let url = new URL(process.env.REACT_APP_REST_API + endpoint)
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))

        return fetch(url).then(response => {
            if (!response.ok) {
                if (response.status === 401) {
                    clearRequestData()
                    setTokenExpire(true)
                }
                throw new Error(response.status + " " + response.statusText)
            }
            return response.json()
        });
    }

    function clearRequestData() {
        window.clearTimeout(intervalRequest);
        window.clearTimeout(intervalRequestSuppliers);
        dataOrders_global = []
        dataSuppliers_global = []
    }

    function setLayerData(data, time = 0) {
        let maxDistrictDensity = 0
        let maxWardDensity = 0
        let mostActivePoints = []

        // Generate more data for ActivityLayer (total points/ most active point)
        if (data && data.dataOrders) {
            if (Array.isArray(data.dataOrders)) {
                const sortedDataOrders = sortBy(data.dataOrders, o => o[2]).reverse()

                sortedDataOrders.every(o => {
                    if (o[2] >= ACTIVE_POINT_NUMBER_ORDERS) {
                        mostActivePoints.push(o)
                        return true
                    }
                    else return false
                })

                if (mostActivePoints.length < NUMBERS_OF_MOST_ACTIVE_POINT) {
                    mostActivePoints = sortedDataOrders.splice(0, NUMBERS_OF_MOST_ACTIVE_POINT)
                }
            }
        }

        if (data && data.dataOrders && data.wardsGeojson) {
            if (typeof data.wardsGeojson === 'string') {
                data.wardsGeojson = dataSources[data.wardsGeojson]
            }

            const geojsonData = mapPointToPolygon(data.dataOrders.features, data.totalOrders, data.wardsGeojson, EXCLUDED_DISTRICT[city])
            data.wardsGeojson = geojsonData.geojson
            maxDistrictDensity = geojsonData.maxDistrictDensity
            maxWardDensity = geojsonData.maxWardDensity
        }

        const info = {
            ...layerInfo,
            dataOrders: dataOrders_global,
            totalSuppliers: totalSuppliers_global,
            totalOrders: totalOrders_global,
            wardsGeojson: wardsGeojson_global,
            maxDistrictDensity,
            maxWardDensity,
            dataSuppliers: dataSuppliers_global,
            city,
            groupBy,
            ...timeFilter,
            showComplete,
            dataLoaded: true,
            ...data,
        }

        if (mostActivePoints.length > 0) {
            info.mostActivePoints = mostActivePoints
        }

        setTimeout(() => {
            setLayerInfo(info)
        }, time)

        if (data.dataOrders) dataOrders_global = data.dataOrders
        if (data.totalSuppliers) totalSuppliers_global = data.totalSuppliers
        if (data.totalOrders) totalOrders_global = data.totalOrders
        if (data.dataSuppliers) dataSuppliers_global = data.dataSuppliers
        if (data.wardsGeojson) wardsGeojson_global = data.wardsGeojson
    }

    useLayoutEffect(() => {
        const delay = layer !== '9' && layer !== '10' ? 0 : 1500 // delay time for transition of Trip Routes map
        const _layerInfo = layers.find(l => l.id === layer)
        // Clear previous requester that requster old data
        clearRequestData()

        // Handle fetch data from api
        if (_layerInfo.dateRequestMethod === "api") {
            let params = {
                city_id: city,
                token
            }

            if (groupBy) {
                params = {...params, group_by: groupBy}
            }
            if (_layerInfo.dataType) {
                params = {...params, data_type: _layerInfo.dataType}
            }
            if (showComplete) {
                params = {...params, show_complete: showComplete}
            }
            if (partner) {
                params = {...params, partner}
            }
            if (service) {
                params = {...params, service_id: getService(service, params.city_id)}
            }
            if (timeFilter.fromTime) {
                params = {...params, from_time: timeFilter.fromTime / 1000}
            }
            if (timeFilter.toTime) {
                params = {...params, to_time: timeFilter.toTime / 1000}
            }
            if (advancedConfig) {
                params = {...params, advanced_config: advancedConfig}
            }

            isLoadingData = true
            isLoadingDataSuppliers = true
            let loaders = [
                getRealTimeData(_layerInfo.endpoints.orders, params),
                getRealTimeData(_layerInfo.endpoints.suppliers, params)
            ]

            if (_layerInfo.endpoints.wardsGeojson) {
                loaders.push(getDataSources(_layerInfo.endpoints.wardsGeojson(city)))
            }

            Promise.all(loaders)
                .then(data => {
                    let payload = {
                        dataOrders: data[0].orders,
                        totalSuppliers: data[0].total_suppliers,
                        totalOrders: data[0].total_orders,
                        dataSuppliers: data[1]
                    }
                    if (_layerInfo.endpoints.wardsGeojson) {
                        payload.wardsGeojson = data[2]
                        setDataSources({
                            ...dataSources,
                            [_layerInfo.endpoints.wardsGeojson(city)]: payload.wardsGeojson
                        })
                    }

                    setLayerData(payload)
                    isLoadingData = false
                    isLoadingDataSuppliers = false
                })
                .catch(() => {
                    isLoadingData = false
                    isLoadingDataSuppliers = false
                })

            getDataInterval(_layerInfo.endpoints, params)
        }
        // Handle get static data from server
        else {
            getDataSources(_layerInfo.data)
                .then(data => {
                    setLayerData({
                        data,
                        city: _layerInfo.city
                    }, delay)
                })
                .catch(e => console.error(e))
        }

        return () => {
            clearRequestData()
        };

    }, [layer, city, groupBy, showComplete, timeFilter.fromTime, timeFilter.toTime, advancedConfig])

    function getDataSources(name) {
        return new Promise((resolve, reject) => {
            if (!name) reject('Data name cannot be null')
            // Handle get static data from memory
            if (dataSources[name]) {
                resolve(dataSources[name])
            }
            // Handle get static data from server
            else {
                requestJson(name).then(data => {
                    setDataSources({
                        ...dataSources,
                        [name]: data
                    })
                    resolve(data)
                });
            }
        })
    }

    function onChangeLayer(layerId) {
        const _layerInfo = layers.find(l => l.id === layerId)
        if (_layerInfo) {
            setLayer(layerId)
            setCity(_layerInfo.city)
            setGroupBy(_layerInfo.groupBy)
            setShowComplete(false)
            setAdvancedConfig(false)

            const now = new Date()
            setTimeFilter({
                fromTime: new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime(),
                toTime: ''
            })
            setLayerInfo({
                ..._layerInfo,
                dataLoaded: false
            })
        }
        else console.error('Cannot find layer');
    }

    function onChangeCity(city) {
        if (city) {
            setCity(city)
            setLayerInfo({
                ...layerInfo,
                city,
                dataLoaded: false
            })

            // getDataInterval(layerInfo.endpoints, {
            //     city_id: city,
            //     group_by: groupBy,
            //     show_complete: showComplete,
            //     token
            // })
        }
        else console.error('Cannot find city');
    }

    function onChangeGroupBy(groupBy) {
        if (groupBy) {
            setGroupBy(groupBy)
            setLayerInfo({
                ...layerInfo,
                groupBy,
                dataLoaded: false
            })

            // getDataInterval(layerInfo.endpoints, {
            //     city_id: city,
            //     group_by: groupBy,
            //     show_complete: showComplete,
            //     token
            // })
        }
        else console.error('Cannot find Groupby');
    }

    function onChangeShowComplete(isShow) {
        setShowComplete(isShow)
        setLayerInfo({
            ...layerInfo,
            showComplete: isShow,
            dataLoaded: false
        })

        // getDataInterval(layerInfo.endpoints, {
        //     city_id: city,
        //     group_by: groupBy,
        //     show_complete: isShow,
        //     token
        // })
    }

    function onChangeAdvancedConfig(value) {
        setAdvancedConfig(value)
        setLayerInfo({
            ...layerInfo,
            advancedConfig: value,
            dataLoaded: false
        })
    }

    function onChangeActiveTimeFilter(data) {
        if (data.fromTime !== timeFilter.fromTime || data.toTime !== timeFilter.toTime) {
            setTimeFilter(data)
            setLayerInfo({
                ...layerInfo,
                ...data,
                dataLoaded: false
            })
        }
    }

    return [
        layerInfo,
        isTokenExprire,
        onChangeLayer,
        onChangeCity,
        onChangeGroupBy,
        onChangeShowComplete,
        onChangeActiveTimeFilter,
        onChangeAdvancedConfig
    ]
}

export default useLayer
