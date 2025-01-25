
import cityJson from './city-mun (3).json'

export const getCityData = () => {
    const formatCityJson = cityJson.map((item) => ({
        value: item.name,
        label: item.name
    }))

    return formatCityJson;
}