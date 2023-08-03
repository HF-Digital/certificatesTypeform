const pdfPrinter = require('pdfmake');

module.exports = async function (context, req) {
	var data = [
		{
			header: 'Sponsor',
			body: 'I’m taking on the Heart Foundation’s MyMarathon challenge this October. Sponsor me by scanning the QR code below.',
		},
		{
			header: 'Sponsor',
			body: 'We’re taking on the Heart Foundation’s MyMarathon challenge this October. Sponsor us by scanning the QR code below.',
		},
		{
			header: 'Join',
			body: 'We’re taking on the Heart Foundation’s MyMarathon challenge this October. Join us by scanning the QR code below.',
		},
	];
	if (req.query.secondary) {
		var secondary = req.query.secondary.toUpperCase();
	} else {
		var secondary = null;
	}

	var dd = {
		info: {
			title: 'Health professional webinar series',
			author: 'National Heart Foundation of Australia',
			subject:
				'CPD Activity #355838 – Unpacking diabetes and the heart: Latest on risk and management strategies',
			producer: 'National Heart Foundation of Australia',
			creator: 'National Heart Foundation of Australia',
		},
		pageSize: 'A4',
		pageMargins: [40, 40, 40, 21],
		header: { image: 'assets/whd_header.png', width: 595 },
		footer: {
			table: {
				widths: '*',
				body: [
					[
						{
							text: ' ',
							fontSize: 12,
							fillColor: '#0e3267',
							color: 'white',
							alignment: 'center',
							lineHeight: 1.1,
						},
					],
				],
			},
			layout: 'noBorders',
			width: 500,
		},

		content: [
			{
				text: 'STATEMENT OF ATTENDANCE',
				color: '#0e3267',
				alignment: 'center',
				bold: true,
				fontSize: 22,
				characterSpacing: 0.2,
				margin: [0, 250, 0, 0],
			},
			{
				text: req.query.fn + ' ' + req.query.ln,
				color: '#0e3267',
				fontSize: 32,
				bold: true,
				alignment: 'center',
				characterSpacing: 0,
				margin: [0, 15, 0, 25],
				lineHeight: 0.6,
			},
			{
				text: [
					'This statement confirms that you have successfully',
				],
				color: '#0e3267',
				fontSize: 16,
				characterSpacing: 0,
				alignment: 'center',
				margin: [0, 0, 0, 2],
			},

			{
				text: [
					'completed the Primary Care Virtual Roadshow workshop on',
				],
				color: '#0e3267',
				fontSize: 16,
				characterSpacing: 0,
				alignment: 'center',
				margin: [0, 0, 0, 2],
			},

			{
				text: [
					'23 February 2023.',
				],
				bold: true,
				color: '#0e3267',
				fontSize: 16,
				characterSpacing: 0,
				alignment: 'center',
				margin: [0, 0, 0, 15],
			},
			{
				text: ['This activity has been accredited by the RACGP',	
				],
				color: '#0e3267',
				fontSize: 16,
				characterSpacing: 0,
				alignment: 'center',
				margin: [20, 0, 0, 2],
			},
			{
				text: [
					'for 1.5 Educational Activity CPD hours',
				],
				color: '#0e3267',
				fontSize: 16,
				characterSpacing: 0,
				alignment: 'center',
				margin: [0, 0, 0, 2],
			},
			{
				text: [
					'(activity no. 416743).',
				],
				color: '#0e3267',
				fontSize: 16,
				characterSpacing: 0,
				alignment: 'center',
				margin: [0, 0, 0, 2],
			},
			{
				image: 'assets/whd_racgp.png',
				width: 180,
				alignment: 'center',
				margin: [0, 15, 0, 0],
			},
			{
				text: ['Education provider'],
				color: '#0e3267',
				fontSize: 10,
				characterSpacing: -0.5,
				alignment: 'center',
				margin: [0, 35, 0, 0],
			},
			{
				image: 'assets/whd_scius.png',
				width: 150,
				alignment: 'center',
			},
		],
	};
	context.log('JavaScript HTTP trigger function processed a request.');

	//const name = req.query.name || (req.body && req.body.name);
	//const responseMessage = name
	//	? 'Hello, ' + name + '. This HTTP triggered function executed successfully.'
	//	: 'This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.';
	const pdf = await generatePDF(dd);
	context.res = {
		// status: 200, /* Defaults to 200 */
		headers: {
			'Content-Type': 'application/pdf',
		},
		// status: 200, /* Defaults to 200 */
		body: pdf,
	};
};

async function generatePDF(docDefinition) {
	const fontDescriptors = {
		Roboto: {
			normal: 'fonts/Avalon_Regular.ttf',
			bold: 'fonts/Avalon_Bold.ttf',
		},
	};
	const printer = new pdfPrinter(fontDescriptors);
	const doc = printer.createPdfKitDocument(docDefinition);

	return new Promise((resolve) => {
		const chunks = [];
		doc.end();
		doc.on('data', (chunk) => {
			chunks.push(chunk);
		});
		doc.on('end', () => {
			resolve(Buffer.concat(chunks));
		});
	});
}
