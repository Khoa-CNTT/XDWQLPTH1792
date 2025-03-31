import { useState } from 'react'
import { Box, Typography, TextField, Button, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Avatar, Grid } from '@mui/material';
import Footer from '~/components/footer/footer';

import AppBar from '~/components/AppBar'

function Profile() {
  const [avatar, setAvatar] = useState(null)

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setAvatar(e.target.result)
      };
      reader.readAsDataURL(file)
    }
  }

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      p: 0,
      paddingTop: 0,
      paddingBottom: -1,
      minHeight: '100vh',
      backgroundImage: 'url(/src/assets/image/anhrung.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>

      <AppBar />
      <Box sx={{ mt: 4, width: '100%' }}></Box>
      <Grid container spacing={2} sx={{ width: '100%', maxWidth: 1200 }}>
        <Grid item xs={12} md={4}>
          <Box sx={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', p: 2, borderRadius: 2 }}>
            <Typography variant="h4" gutterBottom>Thông tin cá nhân</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar sx={{ width: 75, height: 75, mr: 2 }} src={avatar} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="a" gutterBottom sx={{ fontFamily: 'Times New Roman', fontSize: '26px' }}> Nguyễn Ngọc Ngạn</Typography>
                <Button variant="outlined" component="label">
                  Upload
                  <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
                </Button>
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={8}>
          <Box sx={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', p: 2, borderRadius: 2 }}>
            <TextField fullWidth label="Họ và tên" variant="outlined" margin="normal" />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <TextField label="Ngày sinh" variant="outlined" margin="normal" sx={{ flex: 1 }} />
              <FormControl component="fieldset" margin="normal" sx={{ flex: 1 }}>
                <FormLabel component="legend">Giới tính</FormLabel>
                <RadioGroup row>
                  <FormControlLabel value="male" control={<Radio />} label="Nam" />
                  <FormControlLabel value="female" control={<Radio />} label="Nữ" />
                  <FormControlLabel value="other" control={<Radio />} label="Khác" />
                </RadioGroup>
              </FormControl>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <TextField label="Số phòng" variant="outlined" margin="normal" sx={{ flex: 1 }} />
              <TextField label="Điện thoại" variant="outlined" margin="normal" sx={{ flex: 1 }} />
            </Box>
            <TextField fullWidth label="Email" variant="outlined" margin="normal" />
            <TextField fullWidth label="Địa chỉ" variant="outlined" margin="normal" />
            <TextField fullWidth label="Địa chỉ" variant="outlined" margin="normal" />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button variant="contained" color="primary">Lưu</Button>
              <Button variant="outlined" color="secondary">Hủy</Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Box sx={{ mt: 4, width: '100%' }}>
        <Footer />
      </Box>
    </Box>
  );
}

export default Profile