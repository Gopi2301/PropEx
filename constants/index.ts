const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'draft': return 'secondary';
      case 'submitted': return 'outline';
      case 'reviewed': return 'default';
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      case 'waitlisted': return 'secondary';
      case 'reversed': return 'destructive';
      default: return 'outline';
    }
  };

export default getStatusBadgeVariant;
