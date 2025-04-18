import { hostelModel } from '~/models/hostelModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { pickUser } from '~/utils/formmasters'
import { INVITATION_TYPES, HOSTEL_INVITATION_STATUS } from '~/utils/constants'
import { userModel } from '~/models/userModel'
import { invitationModel } from '~/models/invitationModel'
const createNewHostelInvitation = async (reqBody, inviterId) => {
  try {
    // Người đi mời: chính là người đang request, nên chúng ta lấy id từ token
    const inviter = await userModel.findOneById(inviterId)
    // Người được mời: lấy theo email nhận từ phía FE
    const invitee = await userModel.findOneByEmail(reqBody.inviteeEmail)
    // Tìm luôn cái hostel để lấy data xử lý
    const hostel = await hostelModel.findOneById(reqBody.hostelId)

    // Nếu không tồn tại 1 trong 3 cứ thẳng tay reject
    if (!inviter || !invitee || !hostel) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Inviter or Invitee or hostel not found')
    }
    // Tạo data cần thiết để lưu vào DB
    // Có thể  thử bỏ hoặc làm sai lệch type, hostelInvitation, status để test xem model và validation có hoạt động không nhé

    const newInvitationData = {
      inviterId,
      inviteeId: invitee._id.toString(), // Chuyển đổi ObjectId sang string vì sang bên model có check lại
      type: INVITATION_TYPES.HOSTEL_INVITATION,
      hostelInvitation: {
        hostelId: hostel._id.toString(), // Chuyển đổi ObjectId sang string vì sang bên model có check lại
        status: HOSTEL_INVITATION_STATUS.PENDING //Default status là PENDING
      }
    }

    // Gọi sang model để lưu vào DB
    const createNewHostelInvitation = await invitationModel.createNewHostelInvitation(newInvitationData)
    const getInvitation = await invitationModel.findOneById(createNewHostelInvitation.insertedId.toString())

    // Ngoài ra thông tin của hostel invitation mới tạo thì phải trả đủ luôn hostel, inviter, invitee, inviter cho FE thỏa mái xử lý

    const resInvitation = {
      ...getInvitation,
      hostel,
      inviter: pickUser(inviter),
      invitee: pickUser(invitee),
    }
    return resInvitation
  } catch (error) {
    throw error
  }
}

const getInvitations = async (userId) => {
  try {
    const getInvitations = await invitationModel.findByUser(userId)
    // Vì dữ liệu inviter, invitee, hostelId là đang ở giá trị mảng 1 phần tử nếu lấy ra được nên  chùng ta biến đổi nó
    //  vê Json Objecttrước khi trả về
    const resInvitations = getInvitations.map(i => ({
      ...i,
      inviter: i.inviter[0] || {},
      invitee: i.invitee[0] || {},
      hostel: i.hostel[0] || {}
    }
    ))


    return resInvitations
  } catch (error) {
    throw error
  }
}
const updateHostelInvitation = async (userId, invitationId, status) => {
  try {
    // Tìm bản ghi ivitation trong model
    const getInvitation = await invitationModel.findOneById(invitationId)
    if (!getInvitation) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Lời mời không tìm thấy')
    }
    // Sau khi có Invitation rôi thì lấy thông tin của hostel
    const hostelId = getInvitation.hostelInvitation.hostelId
    const getHostel = await hostelModel.findOneById(hostelId)

    if (!getHostel) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Nhà trọ không tìm thấy')
    }
    // Kiểm tra xem nếu status là ACCEPTED join hostel mà cái thằng user (invitee) đã là member của hostel này thì trả về lỗi luôn

    // Note : 2 mảng memberIds và ownerIds của hostel nó đang là kiểu dữ liệu ObjectId nên cho nó về string hết luôn để check 
    const hostelOwnerAndMemberIds = [getHostel.ownerId, ...getHostel.tenantIds].toString()
    if (status === HOSTEL_INVITATION_STATUS.ACCEPTED && hostelOwnerAndMemberIds.includes(userId)) {
      throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Bạn đã là thành viên nhà trọ này rồi !!!')
    }

    // Tạo dữ liệu để update bản ghi lời mời
    const updateData = {
      hostelInvitation: {
        ...getInvitation.hostelInvitation,
        status: status
      }
    }
    // Bước 1: cập nhật lại status trong bản ghi Invitation
    const updatedInvitation = await invitationModel.update(invitationId, updateData)

    if (updateData.hostelInvitation.status === HOSTEL_INVITATION_STATUS.ACCEPTED) {
      await hostelModel.pushTenantIds(hostelId, userId)
    }
    return updatedInvitation
  } catch (error) {
    throw error
  }
}
export const invitationService = {
  createNewHostelInvitation,
  getInvitations,
  updateHostelInvitation
}