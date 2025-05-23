import React, { useEffect, useState } from 'react'
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Box
} from '@mui/material'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import VisibilityIcon from '@mui/icons-material/Visibility'
import AppBar from '~/components/AppBar'
import ModalContract from '~/components/Modal/ModalContract'
import { fetchContractsAPI } from '~/apis'

function MyContractsPage() {
  const [myContracts, setMyContracts] = useState(null)
  const [contract, setContract] = useState(null)
  const [openModal, setOpenModal] = useState(false) // Trạng thái mở/đóng của Dialog
  useEffect(() => {
    fetchContractsAPI().then(res => setMyContracts(res))
  }, [])
  return (
    <>
      <AppBar />
      <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Hợp đồng của bạn
        </Typography>

        {myContracts?.length === 0 ? (
          <Typography variant="body1" color="text.secondary">
            Bạn chưa có hợp đồng nào.
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {myContracts?.map(contract => (
              <Grid item xs={12} sm={6} key={contract._id}>
                <Card variant="outlined" sx={{ borderRadius: 3, boxShadow: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {contract.contractName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Mã hợp đồng: {contract._id}
                    </Typography>
                    <Typography variant="body2">
                      Thời gian: {contract.dateStart} → {contract.dateEnd}
                    </Typography>
                    <Typography
                      variant="body2"
                      color={
                        contract.status === 'Đang hiệu lực'
                          ? 'success.main'
                          : 'error.main'
                      }
                      sx={{ mt: 1 }}
                    >
                      Trạng thái: {contract.status}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ px: 2, pb: 2 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      color="secondary"
                      startIcon={<VisibilityIcon />}
                      onClick={() => {
                        setContract(contract)
                        setOpenModal(true)
                      }
                      }
                    >
                      Xem chi tiết
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container >
      <ModalContract open={openModal} handleClose={() => setOpenModal(false)} contract={contract} />
    </>

  )
}

export default MyContractsPage
