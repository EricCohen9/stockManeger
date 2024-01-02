import { Dialog, DialogTitle, DialogContent, Typography } from '@mui/material';
import { CostumeOrders } from '../interface/orderInterface';
// import datetime from "datetime"
interface OrderDetailsDialogProps {
  order: CostumeOrders | null;
  open: boolean;
  onClose: () => void;  
}

export const OrderDetailsDialog: React.FC<OrderDetailsDialogProps> = ({ 
  order,
  open,
  onClose   
}) => {

  // Check if order is defined
  if(!order) return null;

  return (
    <Dialog open={open} onClose={onClose}>
     <DialogTitle>Order Details</DialogTitle>
      <DialogContent>
        <Typography>ID: {order.id}</Typography>
        <Typography>Address: {order.address}</Typography> 
        <Typography>Price: {order.price}</Typography>
        <Typography>Order Type: {order.orderType}</Typography>
        <Typography>Status: {order.status}</Typography>
        <Typography>Time {order.orderTime.toLocaleString()}</Typography>
        <Typography>user Id {order.userId}</Typography>
      </DialogContent>
    </Dialog>
  );

};
