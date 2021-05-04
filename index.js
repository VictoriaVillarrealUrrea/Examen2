const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

const api_key = process.env.Api_key;
const url = process.env.NATURAL_LANGUAGE_UNDERSTANDING_URL;


const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
    version: '2020-08-01',
    authenticator: new IamAuthenticator({
        apikey: api_key,
    }),
    serviceUrl: url
});

exports.handler = async(event) => {
    const analyzeParams = {
        'text': event.historial_clinico,
        'features': {
            'entities': {
                'sentiment': true,
                'emotion': true,
                'limit': 5,
            },
            'keywords': {
                'sentiment': true,
                'emotion': true,
                'limit': 5,
            },
        },
    };

    const analysisResults = await naturalLanguageUnderstanding.analyze(analyzeParams);
    const keywords = {};
    const entities = {};

    analysisResults.result.keywords.forEach(e => {
        keywords[e.text] = {
            "sentimiento": e.sentiment.label,
            "relevancia": e.relevance,
            "repeticiones": e.count,
            "emocion": e.emotion,
        }
    });

    analysisResults.result.entities.forEach(e => {
        entities[e.text] = {
            tipo: e.type,
            sentimiento: e.sentiment.label,
            relevancia: e.relevance,
            emocion: e.emotion,
            repeticiones: e.count,
            porcentaje_confianza: e.confidence
        }
    });

    response = {
        lenguaje_texto: analysisResults.result.language,
        keywords: analysisResults.result.keywords.map(e => e.text),
        entidades: analysisResults.result.entities.map(e => e.text),
        palabras_clave_desc: keywords,
        entidades_desc: entities,
    }

    return response;
};