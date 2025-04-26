/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
export const messageSkipValue = (conversation, itemsPerConversation ) => {
  // Luôn luôn đảm bảo nếu giá trị không hợp lệ thì return về 0 hết
  if (!conversation || !itemsPerConversation) return 0
  if (conversation <= 0 || itemsPerConversation <= 0) return 0

  /**
   * Giải thích công thức đơn giản dễ hiểu
   * Ví dụ trong trường hợp mỗi page hieenre thị 12 sản phẩm ( itemsPerPage = 12)
   * Case 01: User đứng ở page 1 (page = 1) thì sẽ lấy 1 - 1 = 0 sau đó nhân với 12 thì cũng = 0, lúc này giá trị skip là 0, nghĩa là 0
   skip bản ghi
   * Case 02: User đứng ở page 2 (page =2 ) thì sẽ lấy 2 - 1 = 1 sau đó nhân với 12 thì = 12, lúc này giá trị skip là 12,
   nghĩa là skip 12 bản ghi của 1 page trước đó.
   *.....
   * Case 03: User đứng ở page 5 (page = 5) thì sẽ lấy 5 -1 = 4 sau đó nhân với 12 = 48 , lúc này giá trị skip là 48, nghĩa là skip 48
   bản ghi của 4 page trước đó
   * ....v Tuownng tụ với mọi page khác
   */
  return (conversation - 1) * itemsPerConversation
}