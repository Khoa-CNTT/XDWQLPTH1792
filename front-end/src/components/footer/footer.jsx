import { CssBaseline, Box, Typography, Grid, Link } from '@mui/material';
// Import ảnh
import locationImage from '~/assets/auth/houselogo2.png';
import FbImage from '~/assets/auth/fb.png';
import InsImage from '~/assets/auth/Ins.png';
import TwImage from '~/assets/auth/tw.png';

function Footer() {
  return (
    <Box 
      sx={{ color: 'white', pt: 4, pl: 4, pr: 4,pb: 2, mt: 'auto',
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#2c3e50' : '#3c3f8b')}}>
    <Grid container spacing={2} sx={{ alignItems: 'center', justifyContent: 'space-between' ,margin: '0'}}>
      <Grid container spacing={3} sx={{ maxWidth: '900px', margin: '0',paddingLeft: '40px',paddingTop: '0',}}>
        {/* About Section */}
        <Grid item xs={12} sm={3}>
          <Typography variant="h6" gutterBottom>
            HI WELLCOME
          </Typography>
          <Typography variant="body2">
            <Link href="#" color="#938a8a" underline="hover">
                More information
            </Link>
          </Typography>
          <Typography variant="body2">
            <Link href="#" color="#938a8a" underline="hover">
            Your need help?
            </Link>
          </Typography>
        </Grid>

        {/* Blog Section */}
        <Grid item xs={12} sm={3}>
          <Typography variant="h6" gutterBottom>
            ABOUT WEBSITE
          </Typography>
          <Typography variant="body2">
            <Link href="#" color="#938a8a" underline="hover">
              Tin nhắn của bạn
            </Link>
          </Typography>
          <Typography variant="body2">
            <Link href="#" color="#938a8a" underline="hover">
              Liên hệ với chúng tôi
            </Link>
          </Typography>
          <Typography variant="body2">
            <Link href="#" color="#938a8a" underline="hover">
              Phòng của bạn
            </Link>
          </Typography>
          <Typography variant="body2">
            <Link href="#" color="#938a8a" underline="hover">
              Gửi phản hồi
            </Link>
          </Typography>
        </Grid>

        {/* Products Section */}
        <Grid item xs={12} sm={3}>
          <Typography variant="h6" gutterBottom>
            MORE ABOUT US
          </Typography>
          <Typography variant="body2">
            <Link href="#" color="#938a8a" underline="hover">
              Nguyễn Văn Gia Huy
            </Link>
          </Typography>
          <Typography variant="body2">
            <Link href="#" color="#938a8a" underline="hover">
              Nguyễn Thị Trúc An
            </Link>
          </Typography>
          <Typography variant="body2">
            <Link href="#" color="#938a8a" underline="hover">
              Nguyễn Thị Mỹ Tuyết
            </Link>
          </Typography>
          <Typography variant="body2">
            <Link href="#" color="#938a8a" underline="hover">
              Nguyễn Công Trình
            </Link>
          </Typography>
          <Typography variant="body2">
            <Link href="#" color="#938a8a" underline="hover">
              Nguyễn Lê Quang Sáng
            </Link>
          </Typography>
        </Grid>
      </Grid>
      {/* Location Picture */}
        <Grid item xs={12} sm={3} sx={{ justifyContent: 'flex-end',paddingTop: '0',}}>
            <Box
              component="img"
              src={locationImage} // Sử dụng ảnh đã import
              alt="Location"
              sx={{
                width: '30%',
                maxWidth: '200px', // Giới hạn chiều rộng ảnh
                height: 'auto',
                borderRadius: '50%'
              }}
            />
          
          {/* Contact Section */}
                <Grid item xs={12} sm={3} sx={{ paddingTop: '0', width: '100%', maxWidth: '200px' }}>
                  {/* Social Media */}
                  <Box sx={{ml:'20px', display: 'flex', justifyContent: 'center', gap: 1, mt: 1 }}>
                    <Link href="#" color="inherit" sx={{ display: 'flex', alignItems: 'center' }}>
                      <img src={FbImage} alt="Facebook" width="40" style={{ borderRadius: '50%' }} />
                    </Link>
                    <Link href="#" color="inherit" sx={{ display: 'flex', alignItems: 'center' }}>
                      <img src={TwImage} alt="Twitter" width="57" style={{ borderRadius: '50%' }} />
                    </Link>
                    <Link href="#" color="inherit" sx={{ display: 'flex', alignItems: 'center' }}>
                      <img src={InsImage} alt="Instagram" width="40" style={{ borderRadius: '50%' }} />
                    </Link>
                  </Box>
                </Grid>
        </Grid>
      </Grid>
      {/* Divider */}
      <Box sx={{ borderTop: '1px solid #ddd', mt: 4, pt: 2 ,display: 'flex', alignItems: 'space-between', justifyContent: 'space-between'}}>
        {/* Address */}
        <Box sx={{ alignItems: 'start', justifyContent: 'start' }}>
        <Typography variant="body2" align="" gutterBottom>
          30041975 , Thanh Khê, Đà Nẵng, Việt Nam
        </Typography>
        <Typography variant="body2" align="" gutterBottom>
          HOTLINE: 0123456789 - GMAIL: nguyenvangiahuy12@gmail.com
        </Typography>
        </Box>
        

        {/* Copyright */}
        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          &copy; {new Date().getFullYear()} Dreamy Inc. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}

export default Footer;