const { StatusCodes } = require('http-status-codes');

const handleServerError = (res, error) => {
	console.error(error);

	switch (error.name) {
		case 'ER_BAD_FIELD_ERROR':
			res
				.status(StatusCodes.BAD_REQUEST)
				.send({ message: '잘못된 필드를 참조하였습니다.' });
			break;
		case 'ER_NO_SUCH_TABLE':
			res
				.status(StatusCodes.BAD_REQUEST)
				.send({ message: '존재하지 않는 테이블을 참조하였습니다.' });
			break;
		case 'ER_DUP_ENTRY':
			res
				.status(StatusCodes.CONFLICT)
				.send({ message: '이미 좋아요를 추가한 책입니다.' });
			break;
		case 'ER_DATA_TOO_LONG':
			res
				.status(StatusCodes.BAD_REQUEST)
				.send({ message: '허용된 데이터 길이를 초과하였습니다.' });
			break;
		case 'ER_PARSE_ERROR':
			res
				.status(StatusCodes.BAD_REQUEST)
				.send({ message: 'SQL 구문에 오류가 있습니다.' });
			break;
		case 'ER_BAD_FIELD_ERROR':
		case 'ER_NO_SUCH_TABLE':
		case 'ER_PARSE_ERROR':
		case 'ValidationError':
			res
				.status(StatusCodes.BAD_REQUEST)
				.send({ message: '잘못된 요청입니다.' });
			break;
		case 'AuthenticationError':
			res
				.status(StatusCodes.UNAUTHORIZED)
				.send({ message: '인증에 실패했습니다.' });
			break;
		default:
			res
				.status(StatusCodes.INTERNAL_SERVER_ERROR)
				.send({ message: '내부 서버 오류' });
	}
};

module.exports = handleServerError;
