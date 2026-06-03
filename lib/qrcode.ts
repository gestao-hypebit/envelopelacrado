import QRCode from 'qrcode'

export async function gerarQRCodeBuffer(url: string): Promise<Buffer> {
  const buffer = await QRCode.toBuffer(url, {
    type: 'png',
    width: 300,
    margin: 2,
    color: {
      dark: '#0D0D0D',
      light: '#FAFAF8',
    },
    errorCorrectionLevel: 'M',
  })
  return buffer
}

export async function gerarQRCodeDataURL(url: string): Promise<string> {
  return QRCode.toDataURL(url, {
    type: 'image/png',
    width: 300,
    margin: 2,
    color: {
      dark: '#0D0D0D',
      light: '#FAFAF8',
    },
    errorCorrectionLevel: 'M',
  })
}
