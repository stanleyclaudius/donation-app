export const uploadImage = async(file: File, type: string) => {
  let image = ''

  const formData = new FormData()
  formData.append('file', file)
  type === 'avatar'
  ? formData.append('upload_preset', 'omjqajl9')
  : formData.append('upload_preset', 'njvhgrfr')
  formData.append('cloud_name', 'dpef9sjqt')

  try {
    const res = await fetch('https://api.cloudinary.com/v1_1/dpef9sjqt/upload', {
      method: 'POST',
      body: formData
    })
    const data = await res.json()

    image = data.secure_url
  } catch (err: any) {
    console.log(err)
  }

  return image
}