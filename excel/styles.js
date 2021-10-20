module.exports = {
	header: {
		fill:	{
			fgColor: {
				rgb: 'FFB9D3EE'
			}
		},
    	font:	{
			color:	{
				rgb: 'FF000000'
			},
			sz: 14,
			bold: true
		}
	},

	normal: {

	},	

	footer: {
		fill: {
		fgColor: {
			rgb: 'FFD3D3D3'
			}
		},
		alignment: {
			horizontal: 'center'
		},	
		border: { 
			top: { style: 'medium',	color: 'FF000080'},
			bottom: { style: 'medium',color: 'FF000080'	}
		}	
	},

	headerRight: {
		font: {
			bold: true,
			sz: "11"
		},
		alignment:{
			horizontal: 'right'
		}	
	},

	header: {
		font: {
			bold: true,
			sz: "11"
		},
		alignment: {
			horizontal: 'left'
		}	
	},

	headerCenter: {
		font: {
			bold: true,
			sz: "11"
		},
		alignment: {
			horizontal: 'center'
		}	
	},

	headerCenterBig: {
		font: {
			bold: true,
			sz: "13"
		},
		alignment: {
			horizontal: 'center'
		}	
	},

	headerBordered:{
		font: {
			bold: true,
			sz: "10"
		},
		border: {
			top: {style: 'thick', color: {rgb: "00000000"} },
			bottom: {style: 'thick', color: {rgb: "00000000"} },
			left: {style: 'thin', color: {rgb: "00000000"} },
			right: {style: 'thin', color: {rgb: "00000000"} },			
		},
		alignment: {
			wrapText: true,
			horizontal: "center",
			vertical: "center"			
		}
	},

	borderedCentered: {
		font: {
			sz: "11"
		},
		border: {
			top: {style: 'thin', color: {rgb: "00000000"} },
			bottom: {style: 'thin', color: {rgb: "00000000"} },
			left: {style: 'thin', color: {rgb: "00000000"} },
			right: {style: 'thin', color: {rgb: "00000000"} },			
		},
		alignment: {
			horizontal: "center"
		}
	},

	bordered: {
		font: {
			sz: "11"
		},
		border: {
			top: {style: 'thin', color: {rgb: "00000000"} },
			bottom: {style: 'thin', color: {rgb: "00000000"} },
			left: {style: 'thin', color: {rgb: "00000000"} },
			right: {style: 'thin', color: {rgb: "00000000"} },			
		}
	},
}